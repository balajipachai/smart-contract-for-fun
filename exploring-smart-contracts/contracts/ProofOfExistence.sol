pragma solidity 0.5.12;

/// @title ProofOfExistence
/// @author Balaji Shetty Pachai
/// @dev Contract that implements proof of existence for certificates
contract ProofOfExistence {
    address public owner;

    mapping(string => mapping (uint => string)) private userEventIdHash;

    event LogAddUserEventIdHash(string userIdentifier, uint eventId, string userEventDetailsHash);

    ///@dev Constructuor function that sets the caller to be the owner of this contract
    constructor() public {
        owner = msg.sender;
    }

    ///@dev Modifier only owner, ensures only contract owner can call certain functions
    modifier onlyOwner() {
        require(owner == msg.sender, "Caller is not the owner, thus, reverting.");
        _;
    }

    ///@dev Function that sets the user event hash
    ///@param _userIdentifier Unique string that identifies the user
    ///@param _eventId Event ID
    ///@param _userEventDetailsHash Hash of the certificate
    function setUserEventIdHash(
        string memory _userIdentifier, uint _eventId, string memory _userEventDetailsHash
    )
    onlyOwner
    public
    {
        userEventIdHash[_userIdentifier][_eventId] = _userEventDetailsHash;
    }

    ///@dev Function that returns the user's certificate hash
    ///@param _userIdentifier Unique string that identifies the user
    ///@param _eventId Event ID
    function getUserEventIdHash(string memory _userIdentifier, uint _eventId) public view returns (string memory) {
        return userEventIdHash[_userIdentifier][_eventId];
    }
}