const BigNumber = web3.BigNumber;
const chai = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .use(require('chai-as-promised'));
const assert = chai.assert;
const Fibonacci = artifacts.require('Fibonacci');

contract.only('Fibonacci test suite', accounts => {
  const COINBASE = accounts[0];
  const GASLIMIT = 8000000;
  let fibonacciContractInstance;
  let txObject;

  before(async () => {
    fibonacciContractInstance = await Fibonacci.new({
      from: COINBASE,
      gas: GASLIMIT
    });
  });

  describe('Checks constructor invocation was successful', () => {
    let result;
    it('should check the value of nthFiboNumber[0] to be 1', async () => {
      result = await fibonacciContractInstance.nthFiboNumber.call(0);
      assert.equal(result.toNumber(), 1, 'Constructor invocation failed.');
    });
    it('should check the value of nthFiboNumber[1] to be 1', async () => {
      result = await fibonacciContractInstance.nthFiboNumber.call(1);
      assert.equal(result.toNumber(), 1, 'Constructor invocation failed.');
    });
  });

  describe('fibo', () => {
    context('Calculate some fibo numbers', () => {
      it('calculate fibo(2)', async () => {
        txObject = await fibonacciContractInstance.fibo(2, {
          from: COINBASE,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Fibo invocation failed.');
      });
      it('calculate fibo(3)', async () => {
        txObject = await fibonacciContractInstance.fibo(3, {
          from: COINBASE,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Fibo invocation failed.');
      });
      it('calculate fibo(4)', async () => {
        txObject = await fibonacciContractInstance.fibo(4, {
          from: COINBASE,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Fibo invocation failed.');
      });
      it('calculate fibo(5)', async () => {
        txObject = await fibonacciContractInstance.fibo(5, {
          from: COINBASE,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Fibo invocation failed.');
      });
    });

    context('Verify calculation of fibo(n) was correct', () => {
      let result = [];
      it('get all calculated fibo numbers and store them in an array', async () => {
        result.push(
          (await fibonacciContractInstance.nthFiboNumber.call(0)).toNumber()
        );
        result.push(
          (await fibonacciContractInstance.nthFiboNumber.call(1)).toNumber()
        );
        result.push(
          (await fibonacciContractInstance.nthFiboNumber.call(2)).toNumber()
        );
        result.push(
          (await fibonacciContractInstance.nthFiboNumber.call(3)).toNumber()
        );
        result.push(
          (await fibonacciContractInstance.nthFiboNumber.call(4)).toNumber()
        );
        result.push(
          (await fibonacciContractInstance.nthFiboNumber.call(5)).toNumber()
        );
      });
      it('print the calculated fibo series', () => {
        console.log('\t', result);
      });
      it('should check the calculated series to be [ 1, 1, 2, 3, 5, 8 ]', async () => {
        let fiboSeries = await fibonacciContractInstance.getFiboSeries.call();
        let fiboSeriesConvertedToNumber = [];
        for (let index = 0; index < fiboSeries.length; index++) {
          fiboSeriesConvertedToNumber.push(fiboSeries[index].toNumber());
        }
        assert.deepEqual(
          result,
          fiboSeriesConvertedToNumber,
          'Fibo series do not match.'
        );
      });
    });
  });
});
