const env = require("@nomiclabs/buidler");

async function main() {
    const accounts = await env.ethereum.send("eth_accounts");
    const Greeter = artifacts.require("Greeter");

    const greeter = await Greeter.new("Hello, Buidler!");
    console.log("Greeter deployed to: ", greeter.address);

    [...approvers] = [accounts[10], accounts[11], accounts[12], accounts[13], accounts[14]];
    
    const Copyright = artifacts.require("Copyright");
    const copyright = await Copyright.new(approvers);
    console.log("Copyright deployed to: ", copyright.address);

    // Deploy Copyright contract
}

main()
.then(() => process.exit(0))
.catch(error => {
    console.error('Error while deployment', error);
    process.exit(1);
})