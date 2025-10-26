// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title EscrowContract
 * @dev AI-managed escrow for "Lock $X until milestone completed"
 */
contract EscrowContract is ReentrancyGuard {
    
    IERC20 public immutable usdc;
    
    enum EscrowStatus { Active, Released, Refunded, Disputed }
    
    struct Escrow {
        address payer;
        address recipient;
        uint256 amount;
        uint256 createdAt;
        uint256 deadline;
        EscrowStatus status;
        string description;
        bool requiresMilestone;
        string milestoneDescription;
        bool milestoneCompleted;
    }
    
    mapping(uint256 => Escrow) public escrows;
    uint256 public escrowCounter;
    
    // Events
    event EscrowCreated(
        uint256 indexed escrowId,
        address indexed payer,
        address indexed recipient,
        uint256 amount,
        uint256 deadline
    );
    
    event EscrowReleased(uint256 indexed escrowId, uint256 timestamp);
    event EscrowRefunded(uint256 indexed escrowId, uint256 timestamp);
    event MilestoneCompleted(uint256 indexed escrowId, uint256 timestamp);
    event EscrowDisputed(uint256 indexed escrowId, uint256 timestamp);
    
    constructor(address _usdcAddress) {
        usdc = IERC20(_usdcAddress);
    }
    
    /**
     * @dev Create escrow - AI calls for "Escrow $X for project"
     */
    function createEscrow(
        address recipient,
        uint256 amount,
        uint256 daysUntilDeadline,
        string memory description,
        bool requiresMilestone,
        string memory milestoneDescription
    ) external nonReentrant returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        require(daysUntilDeadline > 0 && daysUntilDeadline <= 365, "Invalid deadline");
        
        // Transfer USDC to contract
        require(
            usdc.transferFrom(msg.sender, address(this), amount),
            "USDC transfer failed"
        );
        
        uint256 escrowId = escrowCounter++;
        uint256 deadline = block.timestamp + (daysUntilDeadline * 1 days);
        
        escrows[escrowId] = Escrow({
            payer: msg.sender,
            recipient: recipient,
            amount: amount,
            createdAt: block.timestamp,
            deadline: deadline,
            status: EscrowStatus.Active,
            description: description,
            requiresMilestone: requiresMilestone,
            milestoneDescription: milestoneDescription,
            milestoneCompleted: false
        });
        
        emit EscrowCreated(escrowId, msg.sender, recipient, amount, deadline);
        
        return escrowId;
    }
    
    /**
     * @dev Release escrow - payer approves completion
     */
    function releaseEscrow(uint256 escrowId) external nonReentrant {
        Escrow storage escrow = escrows[escrowId];
        require(msg.sender == escrow.payer, "Only payer can release");
        require(escrow.status == EscrowStatus.Active, "Escrow not active");
        
        if (escrow.requiresMilestone) {
            require(escrow.milestoneCompleted, "Milestone not completed");
        }
        
        escrow.status = EscrowStatus.Released;
        
        // Transfer USDC to recipient
        require(
            usdc.transfer(escrow.recipient, escrow.amount),
            "USDC transfer failed"
        );
        
        emit EscrowReleased(escrowId, block.timestamp);
    }
    
    /**
     * @dev Refund escrow - after deadline or by mutual agreement
     */
    function refundEscrow(uint256 escrowId) external nonReentrant {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.Active, "Escrow not active");
        require(
            msg.sender == escrow.payer || 
            (msg.sender == escrow.recipient && block.timestamp > escrow.deadline),
            "Not authorized"
        );
        
        escrow.status = EscrowStatus.Refunded;
        
        // Transfer USDC back to payer
        require(
            usdc.transfer(escrow.payer, escrow.amount),
            "USDC transfer failed"
        );
        
        emit EscrowRefunded(escrowId, block.timestamp);
    }
    
    /**
     * @dev Mark milestone as completed - recipient submits proof
     */
    function completeMilestone(uint256 escrowId, string memory proof) external {
        Escrow storage escrow = escrows[escrowId];
        require(msg.sender == escrow.recipient, "Only recipient can mark complete");
        require(escrow.requiresMilestone, "No milestone required");
        require(escrow.status == EscrowStatus.Active, "Escrow not active");
        
        escrow.milestoneCompleted = true;
        
        emit MilestoneCompleted(escrowId, block.timestamp);
    }
    
    /**
     * @dev Dispute escrow - requires external arbitration
     */
    function disputeEscrow(uint256 escrowId) external {
        Escrow storage escrow = escrows[escrowId];
        require(
            msg.sender == escrow.payer || msg.sender == escrow.recipient,
            "Not authorized"
        );
        require(escrow.status == EscrowStatus.Active, "Escrow not active");
        
        escrow.status = EscrowStatus.Disputed;
        
        emit EscrowDisputed(escrowId, block.timestamp);
    }
    
    /**
     * @dev Get escrow details
     */
    function getEscrow(uint256 escrowId) external view returns (
        address payer,
        address recipient,
        uint256 amount,
        uint256 createdAt,
        uint256 deadline,
        EscrowStatus status,
        string memory description,
        bool requiresMilestone,
        bool milestoneCompleted
    ) {
        Escrow memory escrow = escrows[escrowId];
        return (
            escrow.payer,
            escrow.recipient,
            escrow.amount,
            escrow.createdAt,
            escrow.deadline,
            escrow.status,
            escrow.description,
            escrow.requiresMilestone,
            escrow.milestoneCompleted
        );
    }
    
    /**
     * @dev Check if escrow can be released
     */
    function canReleaseEscrow(uint256 escrowId) external view returns (bool) {
        Escrow memory escrow = escrows[escrowId];
        
        if (escrow.status != EscrowStatus.Active) return false;
        if (escrow.requiresMilestone && !escrow.milestoneCompleted) return false;
        
        return true;
    }
}
