const path = require("path");
const fs = require("fs");
const express = require("express");
const { ethers } = require("ethers");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mappings = require("./mappings.json");
const pohc = require("./pohc-logic");

const EVAL_PATH = path.join(__dirname, "evaluations.json");
if (!fs.existsSync(EVAL_PATH)) {
    fs.writeFileSync(EVAL_PATH, JSON.stringify([]));
}

const app = express();
app.use(express.json());

// Configuração do Provider e Wallet
// Usando fallback se a RPC falhar
const RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc";
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const bridgeAddress = process.env.BRIDGE_ADDRESS;

if (!bridgeAddress) {
    console.error("FATAL: BRIDGE_ADDRESS not found in .env");
    process.exit(1);
}

// ABI básica
const bridgeABI = [
    "function executeAutomation(string source, string eventType, bytes32 eventId, address recipient, uint256 amount) external",
    "function owner() view returns (address)"
];
const bridgeContract = new ethers.Contract(bridgeAddress, bridgeABI, wallet);

// Middleware para servir arquivos estáticos (Dashboard)
app.use(express.static(path.join(__dirname, "public")));

// Endpoint: Receber e Registrar Avaliação (Vindo do FugaClaw/Skill)
app.post("/submit-evaluation", async (req, res) => {
    const { userId, prompt, choice, minerA, minerB, rewardWei, txHash } = req.body;

    // Calcula o Score PoHC baseado na nuance da resposta (minerA ou minerB dependendo da escolha)
    const feedbackText = choice === 'miner_a' ? minerA : minerB;
    const score = pohc.computeScore(feedbackText, { minerA_score: 0.8, minerB_score: 0.8 });

    const evaluation = {
        timestamp: new Date().toISOString(),
        userId,
        prompt,
        choice, // 'miner_a' ou 'miner_b'
        minerA,
        minerB,
        rewardWei,
        txHash,
        pohcScore: score.toFixed(4)
    };

    try {
        const history = JSON.parse(fs.readFileSync(EVAL_PATH, 'utf8'));
        history.push(evaluation);
        fs.writeFileSync(EVAL_PATH, JSON.stringify(history, null, 2));
        res.json({ success: true, message: "Avaliação registrada no histórico." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint: Dados para o Dashboard (Ranking e Histórico)
app.get("/dashboard-data", async (req, res) => {
    try {
        const history = JSON.parse(fs.readFileSync(EVAL_PATH, 'utf8'));

        // Calcula o ranking simples
        const ranking = history.reduce((acc, curr) => {
            const winner = curr.choice === 'miner_a' ? 'Minerador A' : 'Minerador B';
            acc[winner] = (acc[winner] || 0) + 1;
            return acc;
        }, {});

        const balance = await provider.getBalance(bridgeAddress);

        res.json({
            ranking,
            history: history.slice(-10).reverse(), // Últimas 10 avaliações
            bridgeBalance: ethers.formatEther(balance),
            totalEvaluations: history.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint: Verificar saldo/créditos de um usuário
app.get("/check-balance/:userId", async (req, res) => {
    const { userId } = req.params;
    const userWallet = mappings[userId];

    if (!userWallet) {
        return res.status(404).json({ error: "Usuário não mapeado no sistema Bridge." });
    }

    try {
        const balance = await provider.getBalance(userWallet);
        res.json({
            userId,
            address: userWallet,
            balanceEther: ethers.formatEther(balance),
            hasCredits: balance > 0n
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint: Disparar pagamento (Recompensa ou Payout)
app.post("/trigger-payout", async (req, res) => {
    const { userId, eventSource, eventType, eventId, amountInWei } = req.body;

    const recipient = mappings[userId];
    if (!recipient) {
        return res.status(404).json({ error: "Usuário não encontrado." });
    }

    try {
        console.log(`Iniciando payout de ${amountInWei} wei para ${recipient}...`);
        const tx = await bridgeContract.executeAutomation(
            eventSource || "FugaClaw",
            eventType || "automation",
            ethers.id(eventId || Date.now().toString()),
            recipient,
            amountInWei
        );

        console.log("Transação enviada:", tx.hash);
        const receipt = await tx.wait();
        res.json({ success: true, txHash: tx.hash, status: receipt.status });
    } catch (error) {
        console.error("Erro no payout:", error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint: Obter link/endereço para depósito e saldo total do contrato
app.get("/bridge-stats", async (req, res) => {
    try {
        const balance = await provider.getBalance(bridgeAddress);
        res.json({
            bridgeContractAddress: bridgeAddress,
            network: "Arbitrum Sepolia",
            totalBalanceEther: ethers.formatEther(balance),
            instructions: "Envie ArbEth para este endereço para carregar o Tesouro do contrato."
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Bridge API Handler rodando na porta ${PORT}`);
    console.log(`📍 Bridge Contract: ${bridgeAddress}`);
});
