const ProofOfExistence = artifacts.require('ProofOfExistence');

module.exports = function deploer(deployer, network, accounts) {
    console.log('Contract will be deployed to ', network, ' network');
    const owner = accounts[0];
    deployer.deploy(ProofOfExistence, { from: owner, gas: 8000000 });
}