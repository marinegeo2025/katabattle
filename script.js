// Basic Express server with simple frontend
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = 'names.json';

// Load names from file
const loadNames = () => {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (err) {
        return [];
    }
};

// Save names to file
const saveNames = (names) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(names, null, 2));
};

// API: Get all names
app.get('/names', (req, res) => {
    res.json(loadNames());
});

// API: Add a new name
app.post('/names', (req, res) => {
    const names = loadNames();
    const newName = req.body.name;
    if (newName && !names.includes(newName)) {
        names.push(newName);
        saveNames(names);
    }
    res.json({ success: true, names }); // Ensure response sends back updated names
});

// API: Reset names list
app.post('/reset', (req, res) => {
    saveNames([]);
    res.json({ success: true, names: [] });
});

// Serve index.html properly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));