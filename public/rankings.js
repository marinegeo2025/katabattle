document.addEventListener("DOMContentLoaded", async () => {
    const rankingForm = document.getElementById("rankingForm");
    const submitRankings = document.getElementById("submitRankings");

    let names = [];
    let rankingCount = 0;

    // Fetch names from server
    async function fetchNames() {
        try {
            const response = await fetch("/names");
            names = await response.json();
            displayRankingForm();
        } catch (err) {
            console.error("Error fetching names:", err);
        }
    }

    // Display ranking inputs
    function displayRankingForm() {
        rankingForm.innerHTML = "";
        names.forEach(name => {
            const div = document.createElement("div");
            div.classList.add("ranking-entry");
            div.innerHTML = `
                <label>${name}</label>
                <input type="number" min="1" max="10" data-name="${name}" class="rankingInput">
            `;
            rankingForm.appendChild(div);
        });

        submitRankings.style.display = "block"; // Show button when form appears
    }

    // Submit rankings and ensure all names are ranked
    submitRankings.addEventListener("click", async () => {
        const rankings = [];
        document.querySelectorAll(".rankingInput").forEach(input => {
            rankings.push({ name: input.dataset.name, score: parseInt(input.value) || 0 });
        });

        if (rankings.length !== names.length) {
            alert("Everyone must submit rankings before continuing!");
            return;
        }

        rankingCount++;
        if (rankingCount >= names.length) {
            await fetch("/submit-rankings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rankings)
            });

            window.location.href = "/results.html"; // Redirect to results
        } else {
            alert(`${names.length - rankingCount} more rankings needed!`);
        }
    });

    fetchNames();
});
