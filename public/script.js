document.addEventListener("DOMContentLoaded", async () => {
  const nameInput = document.getElementById("nameInput");
  const submitButton = document.getElementById("submitButton");
  const nameList = document.getElementById("nameList");
  const kataBattleButton = document.getElementById("kataBattleButton");
  const kataBattleResult = document.getElementById("kataBattleResult");

  let names = [];

  // ===================================
  // 1) Fetch stored names from the backend
  // ===================================
  async function fetchNames() {
    try {
      const response = await fetch("/names");
      names = await response.json();
      updateNameList();
    } catch (err) {
      console.error("Error fetching names:", err);
    }
  }

  // ===================================
  // 2) Fetch chosen fighters from the backend
  // ===================================
  async function fetchChosenFighters() {
    try {
      const response = await fetch("/chosen");
      const chosen = await response.json();
      if (chosen && chosen.fighterA && chosen.fighterB) {
        // If chosen fighters exist, display them
        displayChosenFighters(chosen.fighterA, chosen.fighterB);
      }
    } catch (err) {
      console.error("Error fetching chosen fighters:", err);
    }
  }

  // ===================================
  // Update the list in the UI
  // ===================================
  function updateNameList() {
    nameList.innerHTML = ""; // Clear old list
    names.forEach((name) => {
      const listItem = document.createElement("li");
      listItem.textContent = name;
      // styling omitted for brevity
      nameList.appendChild(listItem);
    });

    // Show Kata Battle button if at least 2 names exist
    kataBattleButton.style.display = names.length >= 2 ? "block" : "none";
  }

  // ===================================
  // Helper to display chosen fighters in the UI
  // ===================================
  function displayChosenFighters(fighterA, fighterB) {
    kataBattleResult.innerHTML = `
      <div class="kata-battle-container">
        <div class="kata-fighter">${fighterA}</div>
        <div class="kata-vs">⚔ VS ⚔</div>
        <div class="kata-fighter">${fighterB}</div>
      </div>
    `;
  }

  // ===================================
  // Handle adding new names
  // ===================================
  submitButton.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    if (!name) return;

    try {
      const response = await fetch("/names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const result = await response.json();
      if (response.ok) {
        names = result.names;
        updateNameList();
        nameInput.value = "";
      } else {
        console.error("Error adding name:", result.message);
      }
    } catch (err) {
      console.error("Request failed:", err);
    }
  });

  // ===================================
  // Handle Kata Battle Button Click
  // ===================================
  kataBattleButton.addEventListener("click", async () => {
    if (names.length < 2) return;

    let shuffledNames = [...names].sort(() => 0.5 - Math.random());
    let fighterA = shuffledNames[0];
    let fighterB = shuffledNames[1];

    // 1) Display locally right away
    displayChosenFighters(fighterA, fighterB);

    // 2) Store on the server so everyone sees it
    try {
      await fetch("/chosen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fighterA, fighterB }),
      });
    } catch (err) {
      console.error("Error posting chosen fighters:", err);
    }
  });

  // ===================================
  // On page load, fetch names & chosen
  // ===================================
  await fetchNames();
  await fetchChosenFighters();

  // (Optional) Poll every few seconds for updates
  // setInterval(fetchChosenFighters, 5000);
});
