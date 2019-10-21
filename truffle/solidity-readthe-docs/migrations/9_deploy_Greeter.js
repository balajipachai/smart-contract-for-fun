const Greeter = artifacts.require('Greeter');

module.exports = function(deployer, network, accounts) {
  const coinbase = accounts[0];

  deployer.deploy(Greeter, {
    from: coinbase,
    gas: 8000000
  });
};
