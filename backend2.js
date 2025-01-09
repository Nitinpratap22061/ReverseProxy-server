const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.json({ server: "Backend Server 2", message: "Hello from 8084" });
});

app.listen(8084, () => {
    console.log("Backend Server 2 running on port 8084");
});
