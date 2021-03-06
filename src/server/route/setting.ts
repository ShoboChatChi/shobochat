import * as express from "express";
import { hash } from "../handler/hashHandler";
import { isValidUsername, isValidUserpass } from "../../common/validate";
import { DatabaseManager } from "../database/DatabaseManager";
import { UserRepository } from "../database/repository/UserRepository";
import { NotificationManager } from "../notification/NotificationManager";

export const settingRoute = express.Router();
const notificationManager: NotificationManager = NotificationManager.getInstance();

settingRoute.get("/", async (req, res, next) => {
    res.sendFile(
        "setting.html",
        {
            root: "../public"
        },
        err => {
            if (err) {
                next(err);
            } else {
                console.log("Send");
            }
        }
    );
});

settingRoute.put("/username", async (req, res) => {
    const sess = req.session;
    if (sess === undefined) {
        console.log("session not working");
        res.status(401).end();
        return;
    }
    const databaseManager = await DatabaseManager.getInstance();
    const userRepository = databaseManager.getRepository(UserRepository);
    const userId = sess.userId;
    const newName = req.body.name;

    try {
        const registredUser = await userRepository.getById(userId);
        if (await userRepository.hasName(newName)) {
            res.status(401).end(); // already registered name
        } else if (!isValidUsername(newName)) {
            res.status(400).end();
        } else {
            await userRepository.updateNameById(userId, newName);
            notificationManager.notifyClientsOfChangedUsername(registredUser.name, newName);
            res.status(200).end();
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

settingRoute.put("/userpass", async (req, res) => {
    const sess = req.session;
    if (sess === undefined) {
        console.log("session not working");
        res.status(401).end();
        return;
    }

    const databaseManager = await DatabaseManager.getInstance();
    const userRepository = databaseManager.getRepository(UserRepository);

    const userId = sess.userId;
    const newPassword = req.body.password;
    if (!isValidUserpass(newPassword)) {
        res.status(400).end();
    }
    try {
        await userRepository.updatePassById(userId, hash(newPassword));
        res.status(200).end();
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});
