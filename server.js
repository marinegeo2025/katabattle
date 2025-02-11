const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;
const DB_FILE = "db.json";

app.use(express.json());
app.use(cors()); // Allow requests from the frontend

// ✅ Load existing names from `db.json` or create an empty list if not found
function loadNames() {
    try {
        const data = fs.readFileSync(DB_FILE, "utf8");
        return JSON.parse(data).names || [];
    } catch (error) {
        console.log("Creating new database file...");
        fs.writeFileSync(DB_FILE, JSON.stringify({ names: [] }), "utf8");
        return [];
    }
}

// ✅ Save names to `db.json`
function saveNames(names) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ names }), "utf8");
}

// ✅ API to get the list of names
app.get("/names", (req, res) => {
    res.json({ names: loadNames() });
});

// ✅ API to add a new name
app.post("/add-name", (req, res) => {
    const names = loadNames();
    const newName = req.body.name.trim();

    if (!newName || names.includes(newName)) {
        return res.status(400).json({ error: "Name is empty or already added." });
    }

    names.push(newName);
    saveNames(names);
    res.json({ success: true, names });
});

// ✅ Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
