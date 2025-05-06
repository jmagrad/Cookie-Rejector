const rejectCookies = () => {
    const rejectKeywords = [
        "reject", "decline", "deny", "refuse",
        "alle ablehnen", "tout refuser", "rechazar", "tudo rejeitar"
    ];

    const cookieMentioned = document.body.innerText.toLowerCase().includes("cookie");

    if (!cookieMentioned) {
        console.log("No cookie mention detected — aborting rejection.");
        return;
    }

    const buttons = [...document.querySelectorAll("button, input[type='button'], a")];

    for (let btn of buttons) {
        const text = (btn.innerText || btn.value || "").toLowerCase().trim();

        // Skip if it includes both a reject keyword AND "pay"
        if (text.includes("pay")) continue;

        if (rejectKeywords.some(k => text.includes(k))) {
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
