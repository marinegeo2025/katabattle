const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Serve static files (like index.html, script.js, style.css)
app.use(express.static("public"));

// ✅ File Path for Name Storage
const FILE_PATH = "names.json";

// ✅ Load names from file
function loadNames() {
    try {
        let data = fs.readFileSync(FILE_PATH, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error loading names.json:", err);
        return [];
    }
}

// ✅ Save names to file
function saveNames(names) {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(names, null, 2), "utf8");
    } catch (err) {
        console.error("Error saving names.json:", err);
    }
}

// ✅ GET API: Retrieve all names
app.get("/names", (req, res) => {
    console.log("✅ GET /names called");
    res.json(loadNames());
});

// ✅ POST API: Add a new name
app.post("/names", (req, res) => {
    let names = loadNames();
    const newName = req.body.name.trim();

    if (!newName) {
        return res.status(400).json({ message: "Invalid name" });
    }
    if (names.includes(newName)) {
        return res.status(400).json({ message: "Name already exists" });
    }

    names.push(newName);
    saveNames(names);
    console.log("✅ Name added:", newName);

    res.json({ message: "Name added", names });
});

// ✅ DELETE API: Reset the list (optional)
app.delete("/names", (req, res) => {
    saveNames([]);
    console.log("✅ Name list cleared");
    res.json({ message: "All names cleared" });
});

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
