document.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.getElementById("nameInput");
    const submitButton = document.getElementById("submitButton");
    const nameList = document.getElementById("nameList");
    const kataBattleButton = document.getElementById("kataBattleButton");
    const kataBattleResult = document.getElementById("kataBattleResult");

    let names = [];

    // ✅ Debugging: Ensure elements are correctly selected
    if (!nameInput || !submitButton || !nameList || !kataBattleButton || !kataBattleResult) {
        console.error("ERROR: One or more required elements not found!");
        return;
    }

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

        // ✅ Create a new list item
        const listItem = document.createElement("li");
        listItem.textContent = name;

        // ✅ Append the new <li> to the <ul>
        nameList.appendChild(listItem);
        console.log("Name added to list.");

        // ✅ Clear input field
        nameInput.value = "";

        // ✅ Ensure Kata Battle button appears if at least 2 names exist
        if (names.length >= 2) {
            kataBattleButton.style.display = "block";
            console.log("Kata Battle button is now visible.");
        }
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
