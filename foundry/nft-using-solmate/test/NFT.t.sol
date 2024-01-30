// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "forge-std/Test.sol";
import "../src/NFT.sol";

contract NFTTest is Test {
    using stdStorage for StdStorage;

    NFT private nft;

    function setUp() public {
        nft = new NFT(
            "Balaji",
            "BNFT",
            "baseURIfsdfasfasdfsfsafsadfsafasfsafasfafsfsafasfsfafsfssdfsafsfsfasfsafsfsafsdfsfsdfdsafdsafsdfadsfdsfdsfdsfdsfdsfdsfsdfsdffasdfdsafsdfdsfdsfdsfadsfdsfsdfsdfdsfdsfdsfsdsdfsfsdfasffsfdsafsdfsadfsdfsdafsdfsdfdsfdsfdsfsdfsadffafdfsdfffdsfsafewrewrttfgsdgasfrewrfwesf",
            address(1)
        );
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

    function test_PreviousMintSucceeded() public {
        nft.mintTo{value: 0.08 ether}(address(1));
        uint256 ownerSlot = stdstore
            .target(address(nft))
            .sig(nft.ownerOf.selector)
            .with_key(1)
            .find();

        console.log("ownerSlot::::::::::::", ownerSlot);

        uint160 ownerOfPreviousMintedToken = uint160(
            uint256(vm.load(address(nft), bytes32(abi.encode(ownerSlot))))
        );

        assertEq(address(1), address(ownerOfPreviousMintedToken));
    }

    function test_RevertMintToZeroAddress() public {
        vm.expectRevert("INVALID_RECIPIENT");
        nft.mintTo{value: 0.08 ether}(address(0));
    }
}
