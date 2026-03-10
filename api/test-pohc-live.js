const axios = require('axios');

async function testPoHCSubmission() {
    const url = 'http://localhost:3000/submit-evaluation';

    // Simulação de um feedback de Janio com alta nuance técnica
    const payload = {
        userId: "JanioFuga_Master",
        prompt: "Explique como otimizar uma bridge L2 entre Bittensor e Arbitrum.",
        choice: "miner_a",
        minerA: "A otimização deve focar na redução de calldata no sequenciador da Arbitrum, utilizando compressão de dados e agregando micro-pagamentos para evitar taxas de gás desnecessárias, mantendo a integridade do consenso PoHC.",
        minerB: "Use uma bridge padrão e envie os tokens.",
        rewardWei: "1000000000000000", // 0.001 ETH
        txHash: "0x" + "a".repeat(64) // Mock hash
    };

    console.log("🚀 Enviando Quest de Alta Nuance para o FugaBridge...");

    try {
        const response = await axios.post(url, payload);
        console.log("✅ Resposta do Servidor:", response.data);
        console.log("\n📊 O Score PoHC foi calculado automaticamente no backend!");
        console.log("Acesse http://localhost:3000 para ver o badge de Cognição no histórico.");
    } catch (error) {
        console.error("❌ Erro no envio:", error.message);
        console.log("Certifique-se de que o servidor está rodando: node api/server.js");
    }
}

testPoHCSubmission();
