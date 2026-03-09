const hre = require("hardhat");
const mappings = require("../api/mappings.json");

async function main() {
    const [owner] = await hre.ethers.getSigners();

    // This should be updated after deployment
    const bridgeAddress = process.env.BRIDGE_ADDRESS;
    if (!bridgeAddress) {
        console.error("Please set BRIDGE_ADDRESS in your .env or as an environment variable");
        process.exit(1);
    }

    const Bridge = await hre.ethers.getContractAt("ArbitrumBridgeHandler", bridgeAddress);

    console.log("Using Bridge at:", bridgeAddress);

    const recipient = mappings["user_id_123"]; // 0x1260Ba50166002E175c5759cFFf49506fEbf86aF
    const amount = hre.ethers.parseEther("0.001");
    const eventId = hre.ethers.id("manual-test-" + Date.now());

    console.log(`Executing automation for ${recipient} with ${hre.ethers.formatEther(amount)} ETH...`);

    const tx = await Bridge.executeAutomation(
        "ManualScript",
        "test_interaction",
        eventId,
        recipient,
        amount
    );

    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("Automation executed successfully!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
