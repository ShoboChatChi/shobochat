"use strict";

$(() => {
    const $updateButton = $("#update");
    const $sendButton = $("#send");

    fetch("/messages")
        .then((response) => {
            return response.json();
        })
        .then((messages) => {
            const $messageList = $("#messageList");
            $messageList.empty();
            messages.forEach((message) => {
                $messageList.append(`<p>time:${message.time} name:${message.name} message:${message.message}</p>`);
            });
        })
        .catch((err) => {
            console.log(err);
        });

    $updateButton.on("click", () => {
        fetch("/messages")
            .then((response) => {
                return response.json();
            })
            .then((messages) => {
                const $messageList = $("#messageList");
                $messageList.empty();
                messages.forEach((message) => {
                    $messageList.append(`<p>time:${message.time} name:${message.name} message:${message.message}</p>`);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    });

    $sendButton.on("click", () => {
        const requestBody = {
            name: $("#name").val(),
            message: $("#message").val()
        };
        fetch("/messages", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                $("#name").val("");
                $("#message").val("");
            })
            .catch((err) => {
                console.log(err);
            });
    });
});
