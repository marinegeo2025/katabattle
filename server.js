const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files (index.html, script.js, style.css) from "public" folder
app.use(express.static("public"));

// --- FILE PATHS ---
const NAMES_FILE = "names.json";
const BATTLE_FILE = "battle.json";

// --- LOAD & SAVE Utility Functions ---

function loadNames() {
  try {
    const data = fs.readFileSync(NAMES_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading names.json:", err);
    return [];
  }
}

function saveNames(names) {
  try {
    fs.writeFileSync(NAMES_FILE, JSON.stringify(names, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving names.json:", err);
  }
}

function loadChosen() {
  try {
    const data = fs.readFileSync(BATTLE_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading battle.json:", err);
    return null; // or return {};
  }
}

function saveChosen(chosen) {
  try {
    fs.writeFileSync(BATTLE_FILE, JSON.stringify(chosen, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving battle.json:", err);
  }
}

// --- ROUTES ---

// 1) GET /names: Retrieve all participant names
app.get("/names", (req, res) => {
  console.log("✅ GET /names called");
  const names = loadNames();
  res.json(names);
});

// 2) POST /names: Add a new name
app.post("/names", (req, res) => {
  const names = loadNames();
  const newName = (req.body.name || "").trim();

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

// 3) DELETE /names: Clear all names (optional reset button)
app.delete("/names", (req, res) => {
  saveNames([]);
  console.log("✅ Name list cleared");
  res.json({ message: "All names cleared" });
});

// 4) POST /chosen: Store the two fighters in battle.json
app.post("/chosen", (req, res) => {
  const { fighterA, fighterB } = req.body;
  if (!fighterA || !fighterB) {
    return res.status(400).json({ message: "Both fighterA and fighterB must be provided." });
  }

  const chosen = { fighterA, fighterB };
  saveChosen(chosen);
  console.log("✅ Chosen fighters updated:", chosen);

  res.json({ message: "Chosen fighters updated" });
});

// 5) GET /chosen: Retrieve the currently chosen fighters
app.get("/chosen", (req, res) => {
  const chosen = loadChosen(); // May be null or { fighterA, fighterB }
  res.json(chosen);
});

// --- START THE SERVER ---
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
