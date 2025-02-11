const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 1988;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const NAMES_FILE = "names.json";
const RANKINGS_FILE = "rankings.json";

let battleFighters = []; // Store the current Kata battle fighters

// Load data from JSON file
function loadData(file) {
    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (err) {
        console.error(`Error loading ${file}:`, err);
        return [];
    }
}

// Save data to JSON file
function saveData(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ✅ GET: Retrieve all names
app.get("/names", (req, res) => {
    res.json(loadData(NAMES_FILE));
});

// ✅ GET: Retrieve all rankings
app.get("/rankings", (req, res) => {
    res.json(loadData(RANKINGS_FILE));
});

// ✅ POST: Submit a ranking
app.post("/submit-ranking", (req, res) => {
    let rankings = loadData(RANKINGS_FILE);
    const submittedRankings = req.body;

    // Ensure we are ranking exactly 2 fighters
    if (!Array.isArray(submittedRankings) || submittedRankings.length !== 2) {
        return res.status(400).json({ message: "Invalid data. Rank exactly 2 fighters." });
    }

    // Validate ranking data
    for (const { name, score } of submittedRankings) {
        if (!battleFighters.includes(name) || score < 1 || score > 10) {
            return res.status(400).json({ message: "Invalid data. Rank only the battle fighters with scores from 1-10." });
        }
        rankings.push({ name, score });
    }

    saveData(RANKINGS_FILE, rankings);

    // ✅ Check if all rankings are submitted
    const totalParticipants = loadData(NAMES_FILE).length;
    const totalRankingsNeeded = totalParticipants * 2; // Each fighter needs to be ranked by all participants

    if (rankings.length >= totalRankingsNeeded) {
        return res.json({ message: "All rankings submitted. Winner can now be declared!" });
    }

    res.json({ message: "Ranking submitted.", remaining: totalRankingsNeeded - rankings.length });
});

// ✅ POST: Set fighters for ranking
app.post("/set-battle-fighters", (req, res) => {
    if (!req.body.fighters || req.body.fighters.length !== 2) {
        return res.status(400).json({ message: "You must select exactly 2 fighters for the battle." });
    }
    battleFighters = req.body.fighters;
    res.json({ message: "Battle fighters set." });
});

// ✅ GET: Retrieve selected fighters
app.get("/battle-fighters", (req, res) => {
    if (battleFighters.length === 2) {
        res.json(battleFighters);
    } else {
        res.status(400).json({ message: "No fighters selected for ranking." });
    }
});

// ✅ DELETE: Reset all data
app.delete("/reset", (req, res) => {
    saveData(NAMES_FILE, []);
    saveData(RANKINGS_FILE, []);
    battleFighters = [];
    res.json({ message: "App has been reset." });
});

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
