const BigNumber = web3.BigNumber;
const chai = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .use(require('chai-as-promised'));
const assert = chai.assert;
const Greeter = artifacts.require('Greeter');

contract('Greeter test suite', accounts => {
  const COINBASE = accounts[0];
  const GASLIMIT = 8000000;
  let greeterContractInstance;
  let txObject;

  before(async () => {
    greeterContractInstance = await Greeter.new({
      from: COINBASE,
      gas: GASLIMIT
    });
  });

  describe('addGreetMessage', () => {
    context('Execute', () => {
      it('should set greeting to "Hello World, Welcome to Solidity!!!"', async () => {
        txObject = await greeterContractInstance.addGreetMessage(
          'Hello World, Welcome to Solidity!!!',
          { from: COINBASE, gas: GASLIMIT }
        );
        assert.equal(txObject.receipt.status, true, 'addGreetMessage failed.');
      });
    });

    context('Check whether execution was successful', () => {
      let result;
      it('should get greeting to be "Hello World, Welcome to Solidity!!!"', async () => {
        result = await greeterContractInstance.greet.call();
        assert.equal(
          result,
          'Hello World, Welcome to Solidity!!!',
          'Set greet message is different.'
        );
      });
      it('should check greetCount to be 1', async () => {
        result = await greeterContractInstance.greetCount.call();
        assert.equal(result.toNumber(), 1, 'Greet count do not match');
      });
    });
  });
});
