document.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.getElementById("nameInput");
    const submitButton = document.getElementById("submitButton");
    const nameList = document.getElementById("nameList");
    const kataBattleButton = document.getElementById("kataBattleButton");
    const kataBattleResult = document.getElementById("kataBattleResult");

    let names = [];

    submitButton.addEventListener("click", () => {
        const name = nameInput.value.trim(); 
        if (name !== "" && !names.includes(name)) { 
            names.push(name);
            const listItem = document.createElement("li");
            listItem.textContent = name;
            nameList.appendChild(listItem);
            nameInput.value = "";

            if (names.length >= 2) {
                kataBattleButton.style.display = "block";
            }
        }
    });

    kataBattleButton.addEventListener("click", () => {
        if (names.length < 2) return;

        let shuffledNames = [...names].sort(() => 0.5 - Math.random());
        let fighterA = shuffledNames[0];
        let fighterB = shuffledNames[1];

        kataBattleResult.innerHTML = `<span>${fighterA}</span> 🆚 <span>${fighterB}</span>`;
    });
});
