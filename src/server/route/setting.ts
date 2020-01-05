import * as express from "express";
import { getConnection } from "typeorm";
import { hash } from "../handler/hashHandler";
import { UserRepository } from "../repository/UserRepository";
import { notifyChangedUsername } from "../handler/webSocketHandler";

export const settingRoute = express.Router();
const connectionType: string = process.env.TYPEORM_CONNECTION_TYPE || "default";

settingRoute.get("/", async (req, res, next) => {
    res.sendFile("setting.html", {
        root: "../public",
    }, (err) => {
        if (err) {
            next(err);
        } else {
            console.log("Send");
        }
    });
});

settingRoute.put("/", async (req, res) => {
    const sess = req.session;
    if (sess === undefined) {
        console.log("session not working");
        res.status(401).end();
        return;
    }

    const userRepository = getConnection(connectionType)
        .getCustomRepository(UserRepository); // global で宣言するとうまくいかない
    const userId = sess.userId;
    const newName = req.body.name;
    const updatedPassword = req.body.password;

    try {
        const registredUser = await userRepository.getById(userId);

        if (newName !== registredUser.name) { // update name and password
            if (await userRepository.hasName(newName)) {
                res.status(401).end(); // already registered name
            } else {
                await userRepository.updateById(userId, newName, hash(updatedPassword));
                notifyChangedUsername(registredUser.name, newName);
                res.status(200).end();
            }
        } else { // update only password
            await userRepository.updateById(userId, registredUser.name, hash(updatedPassword));
            notifyChangedUsername(registredUser.name, newName);
            res.status(200).end();
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});
