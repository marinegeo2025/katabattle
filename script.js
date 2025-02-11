// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDALlweH8VahTiLoCkHov0bpeA4ukDKMaM",
  authDomain: "katabattle-50e58.firebaseapp.com",
  databaseURL: "https://katabattle-50e58-default-rtdb.firebaseio.com",
  projectId: "katabattle-50e58",
  storageBucket: "katabattle-50e58.appspot.com",
  messagingSenderId: "876037518773",
  appId: "1:876037518773:web:249f44c14a7792752895fc",
  measurementId: "G-1027P7BF29"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const namesRef = ref(db, "kataNames");

// ✅ Wait until DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.getElementById("nameInput");
    const submitButton = document.getElementById("submitButton");
    const nameList = document.getElementById("nameList");
    const kataBattleButton = document.getElementById("kataBattleButton");
    const kataBattleResult = document.getElementById("kataBattleResult");

    // ✅ Function to update the name list in the UI
    function updateNameList(names) {
        nameList.innerHTML = ""; // Clear current list
        Object.values(names).forEach(name => {
            const listItem = document.createElement("li");
            listItem.textContent = name;
            nameList.appendChild(listItem);
        });

        // ✅ Show Kata Battle button if 2+ names exist
        kataBattleButton.style.display = nameList.children.length >= 2 ? "block" : "none";
    }

    // ✅ Load names from Firebase when page loads or updates
    onValue(namesRef, (snapshot) => {
        const names = snapshot.val() || {};
        updateNameList(names);
    });

    // ✅ Handle Submit Button Click
    submitButton.addEventListener("click", () => {
        const name = nameInput.value.trim();
        if (name === "") return; // Ignore empty names

        // ✅ Save name to Firebase
        push(namesRef, name);
        nameInput.value = ""; // Clear input
    });

    // ✅ Handle Kata Battle Button Click
    kataBattleButton.addEventListener("click", () => {
        const listItems = document.querySelectorAll("#nameList li");
        if (listItems.length < 2) return;

        let shuffledNames = [...listItems].map(item => item.textContent).sort(() => 0.5 - Math.random());
        let fighterA = shuffledNames[0];
        let fighterB = shuffledNames[1];

        kataBattleResult.innerHTML = `
            <div class="kata-battle-container">
                <div class="kata-fighter">${fighterA}</div>
                <div class="kata-vs">⚔ VS ⚔</div>
                <div class="kata-fighter">${fighterB}</div>
            </div>
        `;
    });

    console.log("🔥 Firebase connected and Kata Battle is live!");
});
