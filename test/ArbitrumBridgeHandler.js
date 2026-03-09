const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ArbitrumBridgeHandler", function () {
    let bridge;
    let owner;
    let recipient;

    beforeEach(async function () {
        [owner, recipient] = await ethers.getSigners();
        const Bridge = await ethers.getContractFactory("ArbitrumBridgeHandler");
        bridge = await Bridge.deploy();
    });

    it("Should set the right owner", async function () {
        expect(await bridge.owner()).to.equal(owner.address);
    });

    it("Should allow owner to execute automation", async function () {
        // Top up bridge balance
        await owner.sendTransaction({
            to: bridge.target,
            value: ethers.parseEther("1.0"),
        });

        const amount = ethers.parseEther("0.1");
        const eventId = ethers.id("test-event");

        await expect(bridge.executeAutomation("Shopify", "payment", eventId, recipient.address, amount))
            .to.emit(bridge, "AutomationExecuted")
            .withArgs("Shopify", "payment", eventId, recipient.address, amount);
    });
});
