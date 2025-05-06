const rejectCookies = () => {
    const rejectKeywords = [
        "reject", "decline", "deny", "refuse",
        "alle ablehnen", "tout refuser", "rechazar", "tudo rejeitar"
    ];

    const paywallIndicators = [
        "pay", "subscribe", "membership", "login to continue", "please subscribe",
        "unlimited access", "support our journalism"
    ];

    const bodyText = document.body.innerText.toLowerCase();

    // Abort if the page looks like a paywall
    if (paywallIndicators.some(p => bodyText.includes(p))) {
        console.log("Paywall indicators found — aborting cookie rejection.");
        return;
    }

    // Abort if "cookie" or "cookies" not mentioned in body
    if (!bodyText.includes("cookie")) {
        console.log("No cookie reference found — aborting.");
        return;
    }

    // Find all likely cookie popups/modals
    const candidateContainers = [...document.querySelectorAll("div, section, aside")]
        .filter(el => {
            const idClass = (el.id + " " + el.className).toLowerCase();
            const text = el.innerText.toLowerCase();
            return (
                idClass.includes("cookie") ||
                idClass.includes("consent") ||
                text.includes("cookie") ||
                text.includes("this website uses cookies")
            );
        });

    if (candidateContainers.length === 0) {
        console.log("No likely cookie banner found — retrying...");
        return setTimeout(rejectCookies, 2000);
    }

    // Scan inside those containers only
    for (const container of candidateContainers) {
        const buttons = [...container.querySelectorAll("button, input[type='button'], a")];

        for (let btn of buttons) {
            const text = (btn.innerText || btn.value || "").toLowerCase().trim();

            // Skip if button text suggests payment or subscription
            if (paywallIndicators.some(p => text.includes(p))) continue;

            if (rejectKeywords.some(k => text.includes(k))) {
                console.log("Rejecting cookies via:", btn);
                btn.click();
                return;
            }
        }
    }

    // Try again in case the banner appears late
    setTimeout(rejectCookies, 2000);
};

window.addEventListener("load", rejectCookies);
