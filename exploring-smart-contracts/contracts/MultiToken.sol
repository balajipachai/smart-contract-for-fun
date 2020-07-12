pragma solidity 0.6.4;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/// @title MultiToken
/// @author Balaji Shetty Pachai
/// @dev ERC20 token with added on security via MultiSigWallet
contract MultiToken is Ownable, ERC20Detailed, ERC20Mintable, ERC20Burnable {
    /// @dev Constructor function
    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        uint8 numberOfDecimals,
        uint256 tokenSupply
    ) public ERC20Detailed(tokenName, tokenSymbol, numberOfDecimals) {
        // mint the tokenSupply number of tokens for msg.sender
        super.mint(msg.sender, tokenSupply);
    }
}
