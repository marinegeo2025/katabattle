import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const namesRef = ref(db, "kataNames");

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

    console.log("Script loaded successfully.");
});
