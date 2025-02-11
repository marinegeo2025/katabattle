document.addEventListener("DOMContentLoaded", async () => {
    const rankingForm = document.getElementById("rankingForm");
    const rankingContainer = document.getElementById("rankingContainer");
    const submitButton = document.getElementById("submitRankings");
    const messageBox = document.getElementById("messageBox");

    let battleFighters = [];

    // ✅ Fetch the two battle fighters
    async function fetchBattleFighters() {
        try {
            const response = await fetch("https://atlantic-swamp-peace.glitch.me/battle-fighters");
            if (!response.ok) {
                throw new Error("No fighters selected for ranking.");
            }
            battleFighters = await response.json();
            displayRankingForm();
        } catch (err) {
            messageBox.textContent = "Error: " + err.message;
        }
    }

    // ✅ Display the ranking form
    function displayRankingForm() {
        if (battleFighters.length !== 2) {
            messageBox.textContent = "Invalid data. Two competitors must be ranked.";
            return;
        }

        rankingContainer.innerHTML = `
            <label>${battleFighters[0]}</label>
            <input type="number" min="1" max="10" id="score1" placeholder="Rate 1-10">
            
            <label>${battleFighters[1]}</label>
            <input type="number" min="1" max="10" id="score2" placeholder="Rate 1-10">
        `;

        submitButton.style.display = "block"; // Show the submit button
    }

    // ✅ Handle form submission
    submitButton.addEventListener("click", async () => {
        const score1 = parseInt(document.getElementById("score1").value);
        const score2 = parseInt(document.getElementById("score2").value);

        if (isNaN(score1) || isNaN(score2) || score1 < 1 || score1 > 10 || score2 < 1 || score2 > 10) {
            messageBox.textContent = "Invalid scores. Please enter values between 1 and 10.";
            return;
        }

        const rankingData = [
            { name: battleFighters[0], score: score1 },
            { name: battleFighters[1], score: score2 }
        ];

        try {
            const response = await fetch("https://atlantic-swamp-peace.glitch.me/submit-ranking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rankingData)
            });

            const result = await response.json();
            messageBox.textContent = result.message;
        } catch (err) {
            messageBox.textContent = "Error submitting ranking.";
        }
    });

    // ✅ Load fighters when the page starts
    fetchBattleFighters();
});
