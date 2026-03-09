const hre = require("hardhat");

async function main() {
    const [owner] = await hre.ethers.getSigners();
    const bridgeAddress = process.env.BRIDGE_ADDRESS;

    if (!bridgeAddress) {
        console.error("BRIDGE_ADDRESS not found in .env");
        return;
    }

    const amount = hre.ethers.parseEther("0.04");
    console.log(`Sending ${hre.ethers.formatEther(amount)} ETH to bridge at ${bridgeAddress}...`);

    const tx = await owner.sendTransaction({
        to: bridgeAddress,
        value: amount,
    });

    await tx.wait();
    console.log("Bridge funded successfully!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
