const MultiToken = artifacts.require('MultiToken');

module.exports = function (deployer, network, accounts) {
    const tokenName = 'MultiToken';
    const tokenSymbol = 'MTT';
    const numberOfDecimals = 18;
    const totalTokenSupply = 1000000000; // 1 Billion

    deployer.deploy(
        MultiToken,
        tokenName,
        tokenSymbol,
        numberOfDecimals,
        totalTokenSupply,
        {
            from: accounts[0]
        }
    );
}