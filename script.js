document.addEventListener("DOMContentLoaded", async () => {
    const nameInput = document.getElementById("nameInput");
    const submitButton = document.getElementById("submitButton");
    const nameList = document.getElementById("nameList");
    const kataBattleButton = document.getElementById("kataBattleButton");
    const kataBattleResult = document.getElementById("kataBattleResult");

    let names = [];

    // ✅ Fetch stored names from the backend
    async function fetchNames() {
        try {
            const response = await fetch("/names");
            names = await response.json();
            console.log("Fetched names:", names);
            updateNameList();
        } catch (err) {
            console.error("Error fetching names:", err);
        }
    }

    // ✅ Update the list in the UI
    function updateNameList() {
        nameList.innerHTML = ""; // Clear old list
        names.forEach(name => {
            const listItem = document.createElement("li");
            listItem.textContent = name;
            nameList.appendChild(listItem);
        });

        // Show Kata Battle button if at least 2 names exist
        kataBattleButton.style.display = names.length >= 2 ? "block" : "none";
    }

    // ✅ Handle adding new names
    submitButton.addEventListener("click", async () => {
        const name = nameInput.value.trim();
        if (!name) return;

        try {
            const response = await fetch("/names", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            });

            const result = await response.json();
            if (response.ok) {
                names = result.names;
                updateNameList();
                nameInput.value = "";
                console.log("Name successfully added.");
            } else {
                console.error("Error adding name:", result.message);
            }
        } catch (err) {
            console.error("Request failed:", err);
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

    // ✅ Load names on page start
    await fetchNames();
});
