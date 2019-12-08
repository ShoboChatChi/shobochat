import { Message } from "./Message";

export function hasSpace(input: string): boolean {
    for(const ch of input) {
        if(ch !== " " && ch !== "\t") {
            return true;
        }
    }
    return false;
}

function isValidMessage(message: Message): boolean {
    let isValid = false;
    const $warnList = $("#warnList");
    $warnList.empty();
    if(!hasSpace(message.name)){
        isValid = true;
        $("<p></p>").text("名前を入力してください").appendTo($warnList);
    }
    if(!hasSpace(message.message)){
        isValid = true;
        $("<p></p>").text("メッセージを入力してください").appendTo($warnList);
    }
    return isValid;
}

export function getMessages(url: string): Promise<Array<Message>> {
    return fetch(url)
        .then((response) => response.json());
}

export function postMessage(url: string, message: Message) {
    return fetch(url, {
        method: "POST",
        body: JSON.stringify(message),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export async function sendMessage(chatApiEndpoint: string) {
    const message: Message = {
        name: $("#name").val() as string,
        message: $("#message").val() as string
    };

    if(isValidMessage(message)) {
        //console.log("Escape send as empty input!")
        return;
    }

    try {
        await postMessage(chatApiEndpoint, message);
    } catch (err) {
        console.log(err);
    }

    $("#name").val("");
    $("#message").val("");
}

export async function showMessages(chatApiEndpoint: string) {
    try {
        const messages = await getMessages(chatApiEndpoint);
        const $messageList = $("#messageList");

        $messageList.empty();
        messages.forEach((message) => {
            if(message.time) {
                const time = new Date(message.time);
                const newMessage = `<p>time:${time} name:${message.name} message:${message.message}</p>`;
                $messageList.append(newMessage);
            }
        });
    } catch (err) {
        console.log(err);
    }
}
