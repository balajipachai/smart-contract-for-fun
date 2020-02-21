const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
  } = require('@openzeppelin/test-helpers');

const Copyright = artifacts.require("Copyright");

// Traditional Truffle test
contract("Copyright", accounts => {
    let copyrighConInstance;
    let coinbase;
    before(async () => {
        coinbase = accounts[0];
        [...approvers] = [accounts[10], accounts[11], accounts[12], accounts[13], accounts[14]];
        copyrighConInstance = await Copyright.new(approvers, {from: coinbase});
    })

    context('Check constructor invocation is success', () => {
        it('should check the approver at index 0 is set', async () => {
            const approversFromCon = await copyrighConInstance.getApprovers();
            assert.equal(approvers[0], approversFromCon[0], 'Approver is not set');
        })
        it('should check the approver at index 1 is set', async () => {
            const approversFromCon = await copyrighConInstance.getApprovers();
            assert.equal(approvers[1], approversFromCon[1], 'Approver is not set');
        })
        it('should check the approver at index 2 is set', async () => {
            const approversFromCon = await copyrighConInstance.getApprovers();
            assert.equal(approvers[2], approversFromCon[2], 'Approver is not set');
        })
        it('should check the approver at index 3 is set', async () => {
            const approversFromCon = await copyrighConInstance.getApprovers();
            assert.equal(approvers[3], approversFromCon[3], 'Approver is not set');
        })
        it('should check the approver at index 4 is set', async () => {
            const approversFromCon = await copyrighConInstance.getApprovers();
            assert.equal(approvers[4], approversFromCon[4], 'Approver is not set');
        })
        it('should check contractOwner is set', async () => {
            const contractOwner = await copyrighConInstance.contractOwner();
            assert.equal(contractOwner, coinbase, 'Owners do not match.')
        })
    })

    context('storeCopyrightDetails', () => {
        let copyrightOwner, timestamp, copyrightHash;

        before(() => {
            copyrightOwner = accounts[1];
            timestamp = Date.now();
            copyrightHash = web3.utils.keccak256("THIS WILL BE REPLACED BY THE DOCUMENT HASH");
        })
        context('reverts', () => {
            it('when called by non-approver', async () => {
                await expectRevert(copyrighConInstance.storeCopyrightDetails(copyrightOwner, timestamp, copyrightHash, {from: coinbase}), "Caller is not approver");
            })
        })

        context('success', () => {
            let receipt;
            it('stores copyright details', async () => {
                receipt = await copyrighConInstance.storeCopyrightDetails(copyrightOwner, timestamp, copyrightHash, {from: approvers[0]});
                assert.equal(receipt.receipt.status, true, 'Store copyright details failed');
            })

            it('reverts when trying to copyright already copyrighted', async () => {
                expectRevert(copyrighConInstance.storeCopyrightDetails(copyrightOwner, timestamp, copyrightHash, {from: approvers[0]}), 'Already Copyrighted.')
            })
            it('emits a LogStoreCopyright event on successful copyright storage', async () => {
                expectEvent(receipt, 'LogStoreCopyright', {
                    _owner: copyrightOwner,
                    _timestamp: new BN(timestamp),
                    _approver: approvers[0]
                })
            })

            context('getCopyrightDetails', () => {
                let result;
                before(async () => {
                    result = await copyrighConInstance.getCopyrightDetails(copyrightHash);
                })
                it('should match copyright owner', async () => {
                    assert.equal(result.copyrightOwner, copyrightOwner, 'Owner do not match');
                })
                it('should match copyright timestamp', async () => {
                    assert.equal(result.timestamp, timestamp, 'Timestamp do not match');
                })
                it('should match copyright approver', async () => {
                    assert.equal(result.approver, approvers[0], 'Approver do not match');
                })
            })
        })
    })
});

