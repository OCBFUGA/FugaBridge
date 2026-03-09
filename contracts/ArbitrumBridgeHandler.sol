// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ArbitrumBridgeHandler
 * @dev Manages automated payouts and event logging for the Web2-Arbitrum Bridge.
 */
contract ArbitrumBridgeHandler {
    address public owner;
    
    event AutomationExecuted(string source, string eventType, bytes32 indexed eventId, address indexed recipient, uint256 amount);
    event FundsDeposited(address indexed sender, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Simple deposit to fund the bridge automation.
     */
    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }

    /**
     * @dev Executes an automated payout triggered by a Web2 event.
     * @param source The Web2 source (e.g., "Shopify", "CRM").
     * @param eventType The type of event (e.g., "payment_received").
     * @param eventId Unique ID from the Web2 system to prevent double processing.
     * @param recipient The L2 address to receive the funds.
     * @param amount The value in wei to be paid out.
     */
    function executeAutomation(
        string calldata source,
        string calldata eventType,
        bytes32 eventId,
        address payable recipient,
        uint256 amount
    ) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient bridge balance");
        
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed");

        emit AutomationExecuted(source, eventType, eventId, recipient, amount);
    }

    /**
     * @dev Allows the owner to withdraw funds from the bridge.
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner).transfer(amount);
        emit FundsWithdrawn(owner, amount);
    }

    /**
     * @dev Transfer ownership to a new address.
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
}
