const Fibonacci = artifacts.require('Fibonacci');

module.exports = function(deployer, network, accounts) {
  const coinbase = accounts[0];

  deployer.deploy(Fibonacci, {
    from: coinbase,
    gas: 8000000
  });
};
