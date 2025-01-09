
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.json({ server: "Backend Server 1", message: "Hello from 8083" });
});

app.listen(8083, () => {
    console.log("Backend Server 1 running on port 8083");
});

