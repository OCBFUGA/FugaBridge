async function fetchDashboardData() {
    try {
        const response = await fetch('/dashboard-data');
        const data = await response.json();

        // Update Stats
        document.getElementById('total-evals').innerText = data.totalEvaluations;
        document.getElementById('bridge-balance').innerText = `Bridge Balance: ${parseFloat(data.bridgeBalance).toFixed(4)} ETH`;

        // Update Ranking
        const rankingList = document.getElementById('ranking-list');
        rankingList.innerHTML = '';

        const miners = Object.entries(data.ranking).sort((a, b) => b[1] - a[1]);
        const maxVotes = Math.max(...miners.map(m => m[1]), 1);

        miners.forEach(([miner, votes]) => {
            const percentage = (votes / maxVotes) * 100;
            const item = document.createElement('div');
            item.className = 'ranking-item';
            item.innerHTML = `
                <span>${miner}</span>
                <div class="bar-container">
                    <div class="bar" style="width: ${percentage}%"></div>
                </div>
                <span>${votes} votos</span>
            `;
            rankingList.appendChild(item);
        });

        // Update History
        const historyBody = document.querySelector('#history-table tbody');
        historyBody.innerHTML = '';

        data.history.forEach(evaluation => {
            const row = document.createElement('tr');
            const date = new Date(evaluation.timestamp).toLocaleTimeString();
            const txShort = `${evaluation.txHash.substring(0, 6)}...${evaluation.txHash.substring(evaluation.txHash.length - 4)}`;

            row.innerHTML = `
                <td>${date}</td>
                <td title="${evaluation.prompt}">${evaluation.prompt.substring(0, 30)}...</td>
                <td class="${evaluation.choice === 'miner_a' ? 'choice-a' : 'choice-b'}">${evaluation.choice === 'miner_a' ? 'Miner A' : 'Miner B'}</td>
                <td><span class="pohc-badge">${evaluation.pohcScore || '---'}</span></td>
                <td><a href="https://sepolia.arbiscan.io/tx/${evaluation.txHash}" target="_blank" class="tx-link">${txShort}</a></td>
                <td class="reward-badge">${(evaluation.rewardWei / 1e18).toFixed(4)} ETH</td>
            `;
            historyBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
}

// Tab Switching Logic
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');

        // Update Buttons
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update Content
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            }
        });
    });
});

// Auto-refresh every 10 seconds
setInterval(fetchDashboardData, 10000);
fetchDashboardData();
