// script.js

// Import Firebase functions using ES Modules
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const namesRef = ref(db, "kataNames");

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // DOM element references
  const nameInput = document.getElementById("nameInput");
  const submitButton = document.getElementById("submitButton");
  const nameList = document.getElementById("nameList");
  const kataBattleButton = document.getElementById("kataBattleButton");
  const kataBattleResult = document.getElementById("kataBattleResult");

  // Function to update the name list in the UI
  function updateNameList(names) {
    nameList.innerHTML = ""; // Clear current list

    // Add each name as a list item
    Object.values(names).forEach(name => {
      const listItem = document.createElement("li");
      listItem.textContent = name;
      nameList.appendChild(listItem);
    });

    // Show Kata Battle button if there are 2 or more names
    kataBattleButton.style.display = nameList.children.length >= 2 ? "block" : "none";
  }

  // Listen for changes in the Firebase database
  onValue(namesRef, (snapshot) => {
    const names = snapshot.val() || {};
    updateNameList(names);
  });

  // Handle the submit button click to add a new name
  submitButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (name === "") return; // Ignore empty submissions

    // Save the new name to Firebase
    push(namesRef, name);
    nameInput.value = ""; // Clear the input field
  });

  // Handle the Kata Battle button click to start the battle
  kataBattleButton.addEventListener("click", () => {
    const listItems = document.querySelectorAll("#nameList li");
    if (listItems.length < 2) return; // Ensure at least two names exist

    // Convert NodeList to array, shuffle names, and pick the first two
    const shuffledNames = [...listItems]
      .map(item => item.textContent)
      .sort(() => 0.5 - Math.random());
    const fighterA = shuffledNames[0];
    const fighterB = shuffledNames[1];

    // Display the Kata Battle result in the UI
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
