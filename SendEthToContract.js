var Web3 = require("web3");
var solc = require('solc')
var fs = require('fs')
const chalk = require('chalk');

// connect to ganache
const netAddr = "http://127.0.0.1:8545";
var web3 = new Web3(new Web3.providers.HttpProvider(netAddr));

var getBalance = (address) => {
	return web3.fromWei( web3.eth.getBalance(address), 'ether').toNumber()
};

let acctSender = web3.eth.accounts[1];
let destAcct = "0x147029a6f932bdd20b4a517736d5b480875c401c";
let contractAddr = "0xd33bcece191dcb95517e8bc21b7d62f4c8c5dcb3";
let amt = 3.0; // 3 eth

console.log("balances before tx:");
console.log("acctSender\t\t", (acctSender), "\nbalance:\t", chalk.green(getBalance(acctSender)), "\n");
console.log("destAcct\t\t", (destAcct), "\nbalance:\t", chalk.green(getBalance(destAcct)), "\n");
console.log("contractAddr\t\t", (contractAddr), "\nbalance:\t", chalk.green(getBalance(contractAddr)), "\n");

console.log(chalk.cyan("attempting to send ") + amt + " ETH from " + acctSender + chalk.cyan(" to ") + contractAddr );

console.log(chalk.cyan("sending " + amt + " ETH from ") + (acctSender) + chalk.cyan(" to ") + (contractAddr) + "\n");
web3.eth.sendTransaction({
	from: acctSender, 
	to: contractAddr, 
	value: web3.toWei(amt, 'ether'), 
	gasLimit: 21000, 
	gasPrice: 20000000000
});

console.log("balances after tx:");
console.log("acctSender\t\t", (acctSender), "\nbalance:\t", chalk.green(getBalance(acctSender)), "\n");
console.log("destAcct\t\t", (destAcct), "\nbalance:\t", chalk.green(getBalance(destAcct)), "\n");
console.log("contractAddr\t\t", (contractAddr), "\nbalance:\t", chalk.green(getBalance(contractAddr)), "\n");

