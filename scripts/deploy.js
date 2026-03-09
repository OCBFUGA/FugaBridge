const hre = require("hardhat");

async function main() {
    console.log("Starting deployment of ArbitrumBridgeHandler...");

    const Bridge = await hre.ethers.getContractFactory("ArbitrumBridgeHandler");
    const bridge = await Bridge.deploy();

    await bridge.waitForDeployment();

    const address = await bridge.getAddress();
    console.log("ArbitrumBridgeHandler deployed to:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
