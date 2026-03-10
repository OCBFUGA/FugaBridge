const fs = require('fs');
const path = require('path');
const file = path.join('api', 'evaluations.json');
const record = {
    timestamp: new Date().toISOString(),
    userId: 'user_id_123',
    prompt: 'Como otimizar um container Docker para baixa latência?',
    choice: 'miner_a',
    minerA: 'Use images base leves (alpine), otimize camadas, e utilize flags de rede do host.',
    minerB: 'Aumente a memória e use máquinas maiores na nuvem.',
    rewardWei: '1000000000000000',
    txHash: '0xeafdef2228dd88ecd252ad63424e0f71a5662ea6983ffa7266c4d3d64b0f9053'
};
fs.writeFileSync(file, JSON.stringify([record], null, 2), 'utf8');
console.log('Record recovered!');
