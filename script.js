document.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.getElementById("nameInput");
    const submitButton = document.getElementById("submitButton");
    const nameList = document.getElementById("nameList");
    const kataBattleButton = document.getElementById("kataBattleButton");
    const kataBattleResult = document.getElementById("kataBattleResult");

    let names = [];

    // ✅ Ensures input box is touchable on iPhone
    nameInput.style.pointerEvents = "auto"; // In case it's being blocked by another element

    // ✅ Force iPhone to recognize the input field properly
    nameInput.addEventListener("touchstart", (event) => {
        event.stopPropagation(); // Prevents interference from other elements
        nameInput.setAttribute("readonly", "true"); // Temporarily set to readonly
        nameInput.removeAttribute("readonly"); // Remove readonly (forces keyboard to open)
        setTimeout(() => {
            nameInput.focus();
        }, 50);
    });

    nameInput.addEventListener("click", (event) => {
        event.stopPropagation();
        nameInput.setAttribute("readonly", "true");
        nameInput.removeAttribute("readonly");
        setTimeout(() => {
            nameInput.focus();
        }, 50);
    });

    // ✅ Handle Submit Button Click
    submitButton.addEventListener("click", () => {
        const name = nameInput.value.trim(); 
        if (name !== "" && !names.includes(name)) { 
            names.push(name);
            const listItem = document.createElement("li");
            listItem.textContent = name;
            nameList.appendChild(listItem);
            nameInput.value = "";

            if (names.length >= 2) {
                kataBattleButton.style.display = "block"; // Show Kata Battle Button
            }
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
});
