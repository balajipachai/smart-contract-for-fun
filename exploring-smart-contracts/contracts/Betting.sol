pragma solidity 0.6.4;


/// @title Betting
/// @author Balaji Shetty Pachai
/// @dev The betting smart contract
contract Betting {
    address payable public OWNER;
    address payable public OPPONENT;
    address payable public ARBITER;
    uint256 public ARBITER_PENALTY_AMOUNT = 0;
    uint256 public DEADLINE_FOR_RESOLVING_DISPUTE;
    uint256 public ARBITER_COMMISION_PERCENT;

    mapping(address => uint256) public arbiterAmount;

    bytes32 private contractTerms;
    enum States {INITIALISATION, OWNER_BET, ARBITER_AGREEMENT}

    States public state;

    event LogOwnersBet(address _owner, uint256 _betAmount, uint256 _timestamp);

    modifier canWithdraw() {
        require(DEADLINE_FOR_RESOLVING_DISPUTE < now, "Cannot withdraw.");
        _;
    }

    modifier onlyOwner() {
        require(OWNER == msg.sender, "Caller is not the owner.");
        _;
    }

    modifier isState(States _currentState) {
        require(state == _currentState, "Contract states do not match.");
        _;
    }

    constructor(
        address payable _arbiter,
        bytes32 _contractTerms,
        uint256 _deadline,
        uint8 _arbiterCommissionPercent,
        uint256 _arbiterPenaltyAmount
    ) public {
        ARBITER = _arbiter;
        OWNER = msg.sender;
        contractTerms = _contractTerms;
        DEADLINE_FOR_RESOLVING_DISPUTE = _deadline;
        ARBITER_COMMISION_PERCENT = _arbiterCommissionPercent;
        ARBITER_PENALTY_AMOUNT = _arbiterPenaltyAmount;
        state = States.INITIALISATION;
    }

    function ownersBet()
        public
        payable
        onlyOwner
        isState(States.INITIALISATION)
    {
        emit LogOwnersBet(msg.sender, msg.value, block.timestamp);
        state = States.OWNER_BET;
    }

    function arbitersAgreement() public payable isState(States.OWNER_BET) {
        require(ARBITER_PENALTY_AMOUNT == msg.value, "Penalty amount is less.");
        ARBITER_PENALTY_AMOUNT = msg.value;
    }

    function withdrawArbiterAmount() public payable canWithdraw {
        msg.sender.transfer(arbiterAmount[msg.sender]);
    }
}
