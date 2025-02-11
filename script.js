document.addEventListener("DOMContentLoaded", () => {
    const nameForm = document.getElementById("nameForm");
    const nameInput = document.getElementById("nameInput");
    const nameList = document.getElementById("nameList");

    nameForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevents page reload

        const name = nameInput.value.trim();
        if (name !== "") {
            const listItem = document.createElement("li");
            listItem.textContent = name;
            nameList.appendChild(listItem);
            nameInput.value = ""; // Clear input after submitting
        }
    });

    // Fix iPhone input issues
    nameInput.addEventListener("touchstart", () => {
        nameInput.focus();
    });
});
