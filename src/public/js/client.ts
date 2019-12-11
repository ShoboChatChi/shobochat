import { sendMessage, showMessages, removeMessage } from "./messageHandler";

$(() => {
    const chatApiEndpoint = "http://localhost:8000/messages";

    $("#update").on("click", () => {
        showMessages(chatApiEndpoint);
    });

    $("#send").on("click", async () => {
        await sendMessage(chatApiEndpoint);
        await showMessages(chatApiEndpoint);
        // $("body").animate({ scrollTop: $(document).height() }, 100);
    });

    let timer: number;
    $(document).on("mousedown", ".messagediv", function() {
        timer = window.setTimeout(async () => {
            if (window.confirm("削除しますか?")) {
                let messageId = $(this).data("messageid");
                if (typeof messageId === "number") {
                    await removeMessage(chatApiEndpoint, $(this).data("messageid"));
                }
                console.log($(this).data("messageid"));
                console.log($(this).data("userid"));
            }
        }, 1000);
    }).on("mouseup mouseleave", () => {
        clearTimeout(timer);
    });

    showMessages(chatApiEndpoint);
});
