document.addEventListener("DOMContentLoaded", async () => {
    const resultsDiv = document.getElementById("results");
    const resetApp = document.getElementById("resetApp");

    let rankings = [];

    async function fetchRankings() {
        try {
            const response = await fetch("/rankings");
            rankings = await response.json();
            displayResults();
        } catch (err) {
            console.error("Error fetching rankings:", err);
        }
    }

    function displayResults() {
        resultsDiv.innerHTML = "<h3>Kata Battle Results</h3>";
        rankings.sort((a, b) => b.score - a.score);

        rankings.forEach(entry => {
            resultsDiv.innerHTML += `
                <div class="result-entry">
                    <span class="result-name">${entry.name}</span>
                    <span class="result-score">${entry.score} points</span>
                </div>
            `;
        });

        const winner = rankings[0].name;
        resultsDiv.innerHTML += `
            <div class="winner-container">
                <h2 class="winner-title">🏆 WINNER: ${winner} 🏆</h2>
            </div>
        `;

        resetApp.style.display = "block"; // Show Reset Button only after results
    }

    resetApp.addEventListener("click", async () => {
        await fetch("/reset", { method: "DELETE" });
        window.location.href = "/";
    });

    fetchRankings();
});
