const rejectCookies = () => {
    const keywords = [
        "reject", "decline", "deny", "refuse",
        "alle ablehnen", "tout refuser", "rechazar", "tudo rejeitar"
    ];

    const buttons = [...document.querySelectorAll("button, input[type='button'], a")];

    for (let btn of buttons) {
        const text = (btn.innerText || btn.value || "").toLowerCase().trim();
        if (keywords.some(k => text.includes(k))) {
            console.log("Rejecting cookies:", btn);
            btn.click();
            return;
        }
    }

    // Try again in case the banner appears late
    setTimeout(rejectCookies, 2000);
};

window.addEventListener("load", () => {
    rejectCookies();
});
