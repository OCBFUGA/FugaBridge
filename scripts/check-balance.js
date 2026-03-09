const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Account:", deployer.address);

    const arbProvider = hre.ethers.provider;
    const arbBalance = await arbProvider.getBalance(deployer.address);
    console.log("Arbitrum Sepolia Balance:", hre.ethers.formatEther(arbBalance), "ETH");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
