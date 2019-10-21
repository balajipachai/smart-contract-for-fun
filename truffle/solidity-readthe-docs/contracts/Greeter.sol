pragma solidity >0.4.23 <0.7.0;

/// @title Greeter contract
/// @author Balaji Shetty Pachai
/// @notice A greeter contract that greets the user
contract Greeter {
	string public greeting;
    uint public greetCount = 0;

    /// Fallback function
    function() external payable {
        msg.sender.transfer(msg.value);
    }

	function addGreetMessage(string memory _greeting) public {
        greetCount += 1;
        greeting = _greeting;
	}

	function greet() public view returns (string memory) {
		return greeting;
	}
}