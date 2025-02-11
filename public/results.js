document.addEventListener("DOMContentLoaded", async () => {
    const resultsDiv = document.getElementById("results");
    const resetApp = document.getElementById("resetApp");

    let rankings = [];

    // Fetch rankings from server
    async function fetchRankings() {
        try {
            const response = await fetch("/rankings");
            rankings = await response.json();
            displayResults();
        } catch (err) {
            console.error("Error fetching rankings:", err);
        }
    }

    // Display final results
   function displayResults() {
    resultsDiv.innerHTML = "<h3>Kata Battle Results</h3>";
    rankings.sort((a, b) => b.score - a.score); // Sort rankings by highest score

    // Display each participant's score
    rankings.forEach(entry => {
        resultsDiv.innerHTML += `
            <div class="result-entry">
                <span class="result-name">${entry.name}</span>
                <span class="result-score">${entry.score} points</span>
            </div>
        `;
    });

    // Highlight the winner
    const winner = rankings[0].name;
    resultsDiv.innerHTML += `
        <div class="winner-container">
            <h2 class="winner-title">🏆 WINNER: ${winner} 🏆</h2>
        </div>
    `;

    // Show Reset Button
    resetApp.style.display = "block";
}


    // Reset app when button is clicked
    resetApp.addEventListener("click", async () => {
        await fetch("/names", { method: "DELETE" });
        await fetch("/submit-rankings", { method: "POST", body: JSON.stringify([]) });
        window.location.href = "/";
    });

    fetchRankings();
});
