document.addEventListener("DOMContentLoaded", async () => {
    const nameInput = document.getElementById("nameInput");
    const submitButton = document.getElementById("submitButton");
    const nameList = document.getElementById("nameList");
    const kataBattleButton = document.getElementById("kataBattleButton");
    const kataBattleResult = document.getElementById("kataBattleResult");

    // ✅ Fetch stored names from the server
    async function fetchNames() {
        try {
            const response = await fetch("https://your-glitch-app-name.glitch.me/names");
            const data = await response.json();
            updateNameList(data.names);
        } catch (error) {
            console.error("Error fetching names:", error);
        }
    }

    // ✅ Update the list visually
    function updateNameList(names) {
        nameList.innerHTML = ""; // Clear the list before repopulating
        names.forEach(name => {
            const listItem = document.createElement("li");
            listItem.textContent = name;
            nameList.appendChild(listItem);
        });

        // Show the Kata Battle button only if there are 2+ names
        if (names.length >= 2) {
            kataBattleButton.style.display = "block";
        }
    }

    // ✅ Handle Submit Button Click
    submitButton.addEventListener("click", async () => {
        const name = nameInput.value.trim();

        if (name === "") {
            console.log("No name entered.");
            return;
        }

        // ✅ Send the name to the server
        try {
            const response = await fetch("https://your-glitch-app-name.glitch.me/add-name", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            const data = await response.json();
            if (data.success) {
                updateNameList(data.names);
            } else {
                console.error("Error adding name:", data.error);
            }
        } catch (error) {
            console.error("Failed to add name:", error);
        }

        nameInput.value = "";
    });

    // ✅ Fetch names when the page loads
    fetchNames();
});
