document.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.getElementById("nameInput");
    const submitButton = document.getElementById("submitButton");
    const nameList = document.getElementById("nameList");
    const kataBattleButton = document.getElementById("kataBattleButton");
    const kataBattleResult = document.getElementById("kataBattleResult");

    let names = JSON.parse(localStorage.getItem("kataNames")) || []; // Load saved names

    // ✅ Function to update the name list in the UI
    function updateNameList() {
        nameList.innerHTML = ""; // Clear current list
        names.forEach(name => {
            const listItem = document.createElement("li");
            listItem.textContent = name;
            nameList.appendChild(listItem);
        });

        // ✅ Ensure Kata Battle button appears if at least 2 names exist
        kataBattleButton.style.display = names.length >= 2 ? "block" : "none";
    }

    // ✅ Load names on page load
    updateNameList();

    // ✅ Handle Submit Button Click
    submitButton.addEventListener("click", () => {
        const name = nameInput.value.trim();

        if (name === "") {
            console.log("No name entered.");
            return;
        }

        if (names.includes(name)) {
            console.log("Name already exists in the list.");
            return;
        }

        console.log("Adding name:", name);
        names.push(name);
        localStorage.setItem("kataNames", JSON.stringify(names)); // Save to localStorage

        updateNameList(); // Refresh UI
        nameInput.value = ""; // Clear input
    });

    // ✅ Handle Kata Battle Button Click
    kataBattleButton.addEventListener("click", () => {
        if (names.length < 2) return;

        let shuffledNames = [...names].sort(() => 0.5 - Math.random());
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
