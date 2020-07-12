const { BN, constants, balance, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const MultiToken = artifacts.require('MultiToken');
const MultiSigWallet = artifacts.require('MultiSigWallet');

contract('MultiToken is [ Ownable, ERC20Detailed, ERC20Mintable, ERC20Burnable ]', (accounts) => {
    const tokenName = 'MultiToken';
    const tokenSymbol = 'MTT';
    const numberOfDecimals = 18;
    const totalTokenSupply = 1000000000; // 1 Billion

    const owner = accounts[0];
    const coinbase = owner;
    const signatories = [accounts[0], accounts[1], accounts[2], accounts[3], accounts[4]];
    const numAuthorizationsRequired = 3;

    let multiTokenContractInstance, multiSigWalletContractInstacne;
    let txObject;
    let data;
    describe('MultiToken transfer via MultiSigWallet', () => {
        before(async () => {
            multiTokenContractInstance = await MultiToken.new(
                tokenName,
                tokenSymbol,
                numberOfDecimals,
                totalTokenSupply,
                {
                    from: accounts[0],
                    gas: 8000000
                }
            );

            multiSigWalletContractInstacne = await MultiSigWallet.new(
                signatories,
                numAuthorizationsRequired,
                {
                    from: accounts[0],
                    gas: 8000000
                }
            );
        });

        context('Transfer 10k MTT to first account without MultiSigWallet', () => {
            const amountToTransfer = new BN(10000);
            const recipient = accounts[1];
            it('should transfer 10k MTT to first account from token holder', async () => {
                txObject = await multiTokenContractInstance.transfer(
                    recipient, 
                    amountToTransfer ,
                    {
                        from: coinbase,
                        gas: 8000000
                    });
                assert.equal(txObject.receipt.status, true, 'Transfer failed.');
            });

            it('should check for Transfer event', async () => {
                await expectEvent(txObject.receipt,
                    'Transfer',
                    {
                        from: coinbase,
                        to: recipient,
                        value: amountToTransfer 
                    }
                );
            });

            it('should check the balance of recipient to be 10k MTT', async () => {
                let balance = await multiTokenContractInstance.balanceOf.call(recipient);
                assert.equal(balance.toNumber(), amountToTransfer.toNumber(), 'Balance do not match.');
            });
        });

         context('Transfer 10k MTT to first account via MultiSigWallet', () => {
            let data;
            const sender = coinbase;
            const recipient = accounts[2];
            const amountToTransfer = 10000;

             before(async () => {
                 // Calculates data that should be submitted
                 data = multiTokenContractInstance.contract.methods.transferFrom(sender, recipient, amountToTransfer).encodeABI();
             })

             context('Before transfer', () => {
                 let balance;
                 it('balance of sender should be 999990000', async () => {
                     balance = await multiTokenContractInstance.balanceOf.call(sender);
                     assert.equal(balance.toNumber(), totalTokenSupply - amountToTransfer, 'Balances do not match')
                 })

                 it('balance of recipient shoud be 0', async () => {
                     balance = await multiTokenContractInstance.balanceOf.call(recipient);
                     assert.equal(balance.toNumber(), 0, 'Balances do not match')
                 })

                 it('transaction count in MultiSigWallet should be 0', async () => {
                     let result = await multiSigWalletContractInstacne.transactionCount.call();
                     assert.equal(result.toNumber(), 0, 'Transaction count do not match.')
                 })
             })

             context('after transfer', () => {
                 context('Submit transaction via MultiSigWallet', () => {
                     let txCount;
                     it('should submit a transaction for transfer', async () => {
                         // submit Transaction
                        txObject = await multiSigWalletContractInstacne.submitTransaction(
                            multiTokenContractInstance.address,
                            0,
                            data,
                            {
                                from: coinbase,
                                gas: 8000000
                            }
                        )
                        assert.equal(txObject.receipt.status, true, 'Submit failed')
                     })

                    it('approve MultiSigWallet to spend tokens', async () => {
                        // Allowance from coinbase to MultiSigWallet s.t. the transfer does not fail
                        txObject = await multiTokenContractInstance.approve(
                            multiSigWalletContractInstacne.address,
                            amountToTransfer,
                            {
                                 from: coinbase,
                                gas: 8000000
                            }
                        )
                        assert.equal(txObject.receipt.status, true, 'Approval failed')
                    })
                 })

                 context('Confirm transactions', () => {
                     let txId;
                     it('get the transactionId for confirming', async () => {
                         txId = (
                             await multiSigWalletContractInstacne.submitTransaction.call(
                                 multiTokenContractInstance.address,
                                 0,
                                 data
                            )
                        ).toNumber()
                        assert.equal(txId - 1, 0, 'Transaction ID do not match.')
                     })

                     it('check the executed flag to be false before confirmation', async () => {
                         let txDetails = await multiSigWalletContractInstacne.transactions.call(txId - 1)
                         assert.equal(txDetails.executed, false, 'Transaction execution failed.')
                     })


                     it('Owner2 confirms the transaction', async () => {
                         txObject = await multiSigWalletContractInstacne.confirmTransaction(txId - 1, {
                             from: signatories[1],
                             gas: 8000000
                         })
                        assert.equal(txObject.receipt.status, true, 'Confirmation failed.')
                     })

                      it('Owner3 confirms the transaction', async () => {
                         txObject = await multiSigWalletContractInstacne.confirmTransaction(txId - 1, {
                             from: signatories[2],
                             gas: 8000000
                         })
                        assert.equal(txObject.receipt.status, true, 'Confirmation failed.')
                     })

                     it('check the executed flag to be true after confirmation', async () => {
                         let txDetails = await multiSigWalletContractInstacne.transactions.call(txId - 1)
                         assert.equal(txDetails.executed, true, 'Transaction execution failed.')
                     })

                 })

                 context('Check balances', () => {
                      let balance;
                        it('balance of sender should be 999980000', async () => {
                            balance = await multiTokenContractInstance.balanceOf.call(sender);
                            assert.equal(balance.toNumber(), totalTokenSupply - (2 * amountToTransfer), 'Balances do not match')
                        })

                        it('balance of recipient shoud be 10000', async () => {
                            balance = await multiTokenContractInstance.balanceOf.call(recipient);
                            assert.equal(balance.toNumber(), amountToTransfer, 'Balances do not match')
                        })

                        it('transaction count in MultiSigWallet should be 1', async () => {
                            let result = await multiSigWalletContractInstacne.transactionCount.call();
                            assert.equal(result.toNumber(), 1, 'Transaction count do not match.')
                        })  
                 })
             })

        });
    });
});