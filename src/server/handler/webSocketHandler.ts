import { getConnection } from "typeorm";
import { Notification, NotifyKind } from "../../common/Notification";
import { wss } from "../server";
import { MessageRepository } from "../repository/MessageRepository";

export function notifyClients(notification: Notification) {
    // 接続されている各Clientにsendする
    wss.clients.forEach(ws => {
        ws.send(JSON.stringify(notification));
    });
}

export async function initMessages() {
    const messageRepository = getConnection()
        .getCustomRepository(MessageRepository); 

    notifyClients({
        kind: NotifyKind.Init,
        payload: await messageRepository.getBeforeSpecifiedTime(Date.now(), 10)
    });
}

export function notifyNewMessage() {
    notifyClients({
        kind: NotifyKind.New,
    });
}

export function notifyChangedMessage(messageId: string) {
    notifyClients({
        kind: NotifyKind.Changed,
        payload: messageId
    });
}

export function notifyDeleteMessage(messageId: string) {
    notifyClients({
        kind: NotifyKind.Deleted,
        payload: messageId
    });
}
