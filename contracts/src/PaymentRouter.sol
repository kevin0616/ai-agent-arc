// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PaymentRouter
 * @dev Main contract for PayFlow AI - routes payments based on AI agent instructions
 * Deployed on Arc blockchain, uses USDC as native token
 */
contract PaymentRouter is ReentrancyGuard, Ownable {
    
    // USDC contract address on Arc (update with actual address)
    IERC20 public immutable usdc;
    
    // Events
    event PaymentExecuted(
        address indexed from,
        address indexed to,
        uint256 amount,
        string memo,
        uint256 timestamp
    );
    
    event SplitPaymentExecuted(
        address indexed payer,
        address[] recipients,
        uint256[] amounts,
        uint256 totalAmount,
        uint256 timestamp
    );
    
    event RecurringPaymentCreated(
        uint256 indexed subscriptionId,
        address indexed payer,
        address indexed recipient,
        uint256 amount,
        uint256 frequency
    );
    
    // Subscription structure
    struct Subscription {
        address payer;
        address recipient;
        uint256 amount;
        uint256 frequency; // in seconds
        uint256 lastPayment;
        bool active;
        string memo;
    }
    
    // Mappings
    mapping(uint256 => Subscription) public subscriptions;
    mapping(address => uint256[]) public userSubscriptions;
    uint256 public subscriptionCounter;
    
    // Transaction limits for safety
    uint256 public maxSingleTransfer = 10000 * 10**6; // $10,000 (USDC has 6 decimals)
    uint256 public dailyLimit = 50000 * 10**6; // $50,000
    mapping(address => uint256) public dailySpent;
    mapping(address => uint256) public lastResetDay;
    
    constructor(address _usdcAddress) {
        usdc = IERC20(_usdcAddress);
    }
    
    /**
     * @dev Simple payment - AI agent calls this for "send $X to Y"
     */
    function sendPayment(
        address recipient,
        uint256 amount,
        string memory memo
    ) external nonReentrant {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        require(amount <= maxSingleTransfer, "Exceeds single transfer limit");
        
        _checkDailyLimit(msg.sender, amount);
        
        // Transfer USDC
        require(
            usdc.transferFrom(msg.sender, recipient, amount),
            "USDC transfer failed"
        );
        
        emit PaymentExecuted(msg.sender, recipient, amount, memo, block.timestamp);
    }
    
    /**
     * @dev Split payment - AI calls this for "split $300 between 3 people"
     */
    function splitPayment(
        address[] memory recipients,
        uint256[] memory amounts,
        string memory memo
    ) external nonReentrant {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length > 0, "No recipients");
        require(recipients.length <= 50, "Too many recipients");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            require(amounts[i] > 0, "Amount must be > 0");
            totalAmount += amounts[i];
        }
        
        _checkDailyLimit(msg.sender, totalAmount);
        
        // Execute all transfers
        for (uint256 i = 0; i < recipients.length; i++) {
            require(
                usdc.transferFrom(msg.sender, recipients[i], amounts[i]),
                "USDC transfer failed"
            );
        }
        
        emit SplitPaymentExecuted(
            msg.sender,
            recipients,
            amounts,
            totalAmount,
            block.timestamp
        );
    }
    
    /**
     * @dev Create recurring payment - AI calls for "pay $50/month to Netflix"
     */
    function createSubscription(
        address recipient,
        uint256 amount,
        uint256 frequencyInDays,
        string memory memo
    ) external returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        require(frequencyInDays > 0, "Invalid frequency");
        
        uint256 subscriptionId = subscriptionCounter++;
        uint256 frequency = frequencyInDays * 1 days;
        
        subscriptions[subscriptionId] = Subscription({
            payer: msg.sender,
            recipient: recipient,
            amount: amount,
            frequency: frequency,
            lastPayment: block.timestamp,
            active: true,
            memo: memo
        });
        
        userSubscriptions[msg.sender].push(subscriptionId);
        
        emit RecurringPaymentCreated(
            subscriptionId,
            msg.sender,
            recipient,
            amount,
            frequency
        );
        
        return subscriptionId;
    }
    
    /**
     * @dev Execute recurring payment - called by keeper or anyone
     */
    function executeSubscription(uint256 subscriptionId) external nonReentrant {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.active, "Subscription not active");
        require(
            block.timestamp >= sub.lastPayment + sub.frequency,
            "Too early to execute"
        );
        
        _checkDailyLimit(sub.payer, sub.amount);
        
        // Transfer USDC
        require(
            usdc.transferFrom(sub.payer, sub.recipient, sub.amount),
            "USDC transfer failed"
        );
        
        sub.lastPayment = block.timestamp;
        
        emit PaymentExecuted(
            sub.payer,
            sub.recipient,
            sub.amount,
            sub.memo,
            block.timestamp
        );
    }
    
    /**
     * @dev Cancel subscription
     */
    function cancelSubscription(uint256 subscriptionId) external {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.payer == msg.sender, "Not subscription owner");
        sub.active = false;
    }
    
    /**
     * @dev Batch payments - for complex AI orchestrated transactions
     */
    function batchPayments(
        address[] memory recipients,
        uint256[] memory amounts,
        string[] memory memos
    ) external nonReentrant {
        require(
            recipients.length == amounts.length && amounts.length == memos.length,
            "Arrays length mismatch"
        );
        require(recipients.length > 0 && recipients.length <= 100, "Invalid batch size");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            require(amounts[i] > 0, "Amount must be > 0");
            totalAmount += amounts[i];
        }
        
        _checkDailyLimit(msg.sender, totalAmount);
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(
                usdc.transferFrom(msg.sender, recipients[i], amounts[i]),
                "USDC transfer failed"
            );
            
            emit PaymentExecuted(
                msg.sender,
                recipients[i],
                amounts[i],
                memos[i],
                block.timestamp
            );
        }
    }
    
    /**
     * @dev Check and update daily limit
     */
    function _checkDailyLimit(address user, uint256 amount) internal {
        uint256 currentDay = block.timestamp / 1 days;
        
        // Reset if new day
        if (lastResetDay[user] < currentDay) {
            dailySpent[user] = 0;
            lastResetDay[user] = currentDay;
        }
        
        require(dailySpent[user] + amount <= dailyLimit, "Daily limit exceeded");
        dailySpent[user] += amount;
    }
    
    /**
     * @dev Admin functions
     */
    function updateMaxSingleTransfer(uint256 newLimit) external onlyOwner {
        maxSingleTransfer = newLimit;
    }
    
    function updateDailyLimit(uint256 newLimit) external onlyOwner {
        dailyLimit = newLimit;
    }
    
    /**
     * @dev Get user's active subscriptions
     */
    function getUserSubscriptions(address user) external view returns (uint256[] memory) {
        return userSubscriptions[user];
    }
    
    /**
     * @dev Get subscription details
     */
    function getSubscription(uint256 subscriptionId) external view returns (
        address payer,
        address recipient,
        uint256 amount,
        uint256 frequency,
        uint256 lastPayment,
        bool active,
        string memory memo
    ) {
        Subscription memory sub = subscriptions[subscriptionId];
        return (
            sub.payer,
            sub.recipient,
            sub.amount,
            sub.frequency,
            sub.lastPayment,
            sub.active,
            sub.memo
        );
    }
}
