const MultiSigWalletContract = artifacts.require("MultiSigWallet")

module.exports = function (deployer, network, accounts) {
    const owner = accounts[0]
    const signatories = [accounts[0], accounts[1], accounts[2], accounts[3], accounts[4]]
    const numAuthorizationsRequired = 3
    deployer.deploy(MultiSigWalletContract, signatories, numAuthorizationsRequired, { from: owner})
}
