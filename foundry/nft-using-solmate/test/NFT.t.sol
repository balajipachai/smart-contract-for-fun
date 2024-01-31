// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "forge-std/Test.sol";
import "../src/NFT.sol";

contract NFTTest is Test {
    using stdStorage for StdStorage;

    NFT private nft;

    function setUp() public {
        nft = new NFT("Balaji", "BNFT", "baseURI", address(1));
    }

    function test_RevertMintWithoutValue() public {
        vm.expectRevert(MintPriceNotPaid.selector);
        nft.mintTo(address(1));
    }

    function test_RevertMintMaxSupplyReached() public {
        uint256 slot = stdstore
            .target(address(nft))
            .sig("currentTokenId()")
            .find();

        bytes32 loc = bytes32(slot);
        bytes32 mockCurrentTokenId = bytes32(abi.encode(10000));
        vm.store(address(nft), loc, mockCurrentTokenId);
        vm.expectRevert(MaxSupply.selector);
        nft.mintTo{value: 0.08 ether}(address(1));
    }

    function test_MintPricePaid() public {
        nft.mintTo{value: 0.08 ether}(address(1));
    }

    function test_NewMintOwnerRegistered() public {
        nft.mintTo{value: 0.08 ether}(address(1));
        uint256 ownerSlot = stdstore
            .target(address(nft))
            .sig(nft.ownerOf.selector)
            .with_key(1)
            .find();

        uint160 ownerOfPreviousMintedToken = uint160(
            uint256(vm.load(address(nft), bytes32(abi.encode(ownerSlot))))
        );

        assertEq(address(1), address(ownerOfPreviousMintedToken));
    }

    function test_RevertMintToZeroAddress() public {
        vm.expectRevert("INVALID_RECIPIENT");
        nft.mintTo{value: 0.08 ether}(address(0));
    }

    function test_BalanceIncremented() public {
        nft.mintTo{value: 0.08 ether}(address(1));
        uint256 slotBalance = stdstore
            .target(address(nft))
            .sig(nft.balanceOf.selector)
            .with_key(address(1))
            .find();

        uint256 balanceFirstMint = uint256(
            vm.load(address(nft), bytes32(slotBalance))
        );

        assertEq(balanceFirstMint, 1);

        nft.mintTo{value: 0.08 ether}(address(1));

        slotBalance = stdstore
            .target(address(nft))
            .sig(nft.balanceOf.selector)
            .with_key(address(1))
            .find();

        uint256 balanceSecondMint = uint256(
            vm.load(address(nft), bytes32(slotBalance))
        );
        assertEq(balanceSecondMint, 2);
    }

    function test_SafeContractReceiver() public {
        Receiver receiver = new Receiver();
        nft.mintTo{value: 0.08 ether}(address(receiver));
        uint256 slotBalance = stdstore
            .target(address(nft))
            .sig(nft.balanceOf.selector)
            .with_key(address(receiver))
            .find();
        uint256 balanceFirstMint = uint256(
            vm.load(address(nft), bytes32(slotBalance))
        );
        assertEq(balanceFirstMint, 1);
    }

    function test_UnsafeConractReceiver() public {
        // Creates a fake contract
        vm.etch(address(11), bytes("fake code"));
        vm.expectRevert(bytes(""));
        nft.mintTo{value: 0.08 ether}(address(11));
    }

    function test_WithdrawalWorksAsOwner() public {
        //Minting an NFT will send 0.08 ETH to the contract
        uint256 priorMintContractBalance = payable(address(nft)).balance;
        nft.mintTo{value: nft.MINT_PRICE()}(address(1));
        uint256 afterMintContractBalance = payable(address(nft)).balance;
        assertEq(afterMintContractBalance, nft.MINT_PRICE());

        // Withdraw ETH from the contract
        address payee = address(0x4567);
        uint256 payeeBalanceBeforeWithdrawal = payable(payee).balance;
        vm.prank(address(1)); // since address(1) is the contract owner
        nft.withdrawPayments(payable(payee));
        assertEq(
            payable(payee).balance,
            payeeBalanceBeforeWithdrawal + nft.MINT_PRICE()
        );
        vm.stopPrank();
    }

    function test_WithdrawalFailAsNonOwner() public {
        //Minting an NFT will send 0.08 ETH to the contract
        uint256 priorMintContractBalance = payable(address(nft)).balance;
        nft.mintTo{value: nft.MINT_PRICE()}(address(1));
        uint256 afterMintContractBalance = payable(address(nft)).balance;
        assertEq(afterMintContractBalance, nft.MINT_PRICE());

        bytes memory customError = abi.encodeWithSelector(
            OwnableUnauthorizedAccount.selector,
            address(this)
        );
        // Withdraw ETH from the contract
        address payee = address(0x4567);
        vm.mockCallRevert(
            address(this),
            abi.encodeWithSelector(
                nft.withdrawPayments.selector,
                payable(address(payee))
            ),
            customError
        );
        vm.expectRevert(customError);
        nft.withdrawPayments(payable(payee));
    }
}

contract Receiver is ERC721TokenReceiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 id,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
