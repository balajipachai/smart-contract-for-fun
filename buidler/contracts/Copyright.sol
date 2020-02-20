pragma solidity ^0.6.1;

import "@nomiclabs/buidler/console.sol";

/**
* @title Copyright
* @dev Copyright Smart contract
* @author Balaji Shetty Pachai
 */
contract Copyright {
    address[5] private _approvers;
    address public contractOwner;

    mapping (bytes32 => Details) public copyrightDetails;
    mapping (bytes32 => address) private _copyrightOwner;
    mapping (address => bool) private _isApprover;

    event LogStoreCopyright(address _owner, uint256 _timestamp, address _approver);
    
    struct Details {
        address owner;
        uint256 timestamp;
        address approver;
    }
    
    // modifier onlyApprover
    modifier onlyApprover() {
        require(_isApprover[msg.sender], "Caller is not approver");
        _;
    }
    
    /**
    * @dev Constructor function
    */
    constructor (address[5] memory _approversArray) public {
        contractOwner = msg.sender;
        for (uint8 i = 0; i < _approversArray.length; i++) {
            _approvers[i] = _approversArray[i];
            _isApprover[_approversArray[i]] = true;
        }
    }
    
    /**
    * Function to store copyrightDetails
    * @param _owner Address of the Copyright owner
    * @param _timestamp Timestamp of Copyright
    * @param _copyrightHash Hash of the Copyright document
    */
    function storeCopyrightDetails(address _owner, uint256 _timestamp, bytes32 _copyrightHash) public onlyApprover {
        console.log("Parameter owner and timestamp: ", _owner, _timestamp);
        console.logBytes32(_copyrightHash);
        require(_copyrightOwner[_copyrightHash] == address(0), "Already Copyrighted.");
        copyrightDetails[_copyrightHash].owner = _owner;
        copyrightDetails[_copyrightHash].timestamp = _timestamp;
        copyrightDetails[_copyrightHash].approver = msg.sender;
        _copyrightOwner[_copyrightHash] = _owner;
        emit LogStoreCopyright(_owner, _timestamp, msg.sender);
    }
    
    /**
    * Function to get the copyright details
    * @param _copyrightHash Hash of the Copyright document
    */
    function getCopyrightDetails(bytes32 _copyrightHash) public view returns (address copyrightOwner, uint256 timestamp, address approver) {
        (copyrightOwner, timestamp, approver) = (
            copyrightDetails[_copyrightHash].owner, copyrightDetails[_copyrightHash].timestamp, copyrightDetails[_copyrightHash].approver
        );
        console.log("Returned details: ", copyrightOwner, timestamp, approver);
    }

    /**
    * Function that gets the list of approvers
    */
    function getApprovers() public view returns (address[5] memory) {
        return _approvers;
    }
}