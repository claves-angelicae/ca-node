#!/usr/bin/env node

if (!process.argv[4]) {
	console.log("Usage: ./SendEthToContract.js <contract address> <from address> <eth amt>");
}

let contractAddr = process.argv[2];
let fromAddress = process.argv[3];
let amt = process.argv[4];

var Web3 = require("web3");
var fs = require('fs')
const chalk = require('chalk');

// // connect to ganache
const netAddr = "http://127.0.0.1:8545";
var web3 = new Web3(new Web3.providers.HttpProvider(netAddr));

console.log("sending\t\t", chalk.green(amt + " ether"));

web3.eth.getBalance(contractAddr, function(err, balance) {
	console.log("contract balance before");
 	console.log(web3.utils.fromWei(balance, "ether") + " ether");

	console.log(chalk.cyan("sending " + amt + " ETH from ") + (fromAddress) + chalk.cyan(" to ") + (contractAddr) + "\n");

	web3.eth.sendTransaction({
		from: fromAddress, 
		to: contractAddr, 
		value: web3.utils.toWei(amt, 'ether'), 
		gasLimit: 800000, 
		gasPrice: 20000000000
	}); 	

	web3.eth.getBalance(contractAddr, function(err, balance) {
		console.log("contract balance after");
 		console.log(web3.utils.fromWei(balance, "ether") + " ether");
	});

});



// console.log("balance of contract address", contractAddr);
// web3.eth.getBalance(contractAddr, function(err, balance) {
//  console.log(web3.utils.fromWei(balance, "ether") + " ether");
// });


// await web3.eth.getBalance(fromAddress, function(err, balance) {
//  console.log("balance of from address", fromAddress);
//  console.log(web3.utils.fromWei(balance, "ether") + " ether");
// });

// web3.eth.sendTransaction({
// 	from: fromAddress, 
// 	to: contractAddr, 
// 	value: web3.utils.toWei(amt, 'ether'), 
// 	gasLimit: 21000, 
// 	gasPrice: 20000000000
// });

// var sendEth = function(addr1, addr2) {
// 	console.log(addr1, addr2);

// 	let acctSender = addr1;
// 	let destAcct = addr2;
// 	let contractAddr = "0xd33bcece191dcb95517e8bc21b7d62f4c8c5dcb3";
// 	let amt = 3.0; // 3 eth

// 	// console.log("balances before tx:");
// 	// console.log("acctSender\t\t", (acctSender), "\nbalance:\t", chalk.green(getBalance(acctSender)), "\n");
// 	// console.log("destAcct\t\t", (destAcct), "\nbalance:\t", chalk.green(getBalance(destAcct)), "\n");
// 	// console.log("contractAddr\t\t", (contractAddr), "\nbalance:\t", chalk.green(getBalance(contractAddr)), "\n");

// 	// console.log(chalk.cyan("attempting to send ") + amt + " ETH from " + acctSender + chalk.cyan(" to ") + contractAddr );

// 	console.log(chalk.cyan("sending " + amt + " ETH from ") + (acctSender) + chalk.cyan(" to ") + (contractAddr) + "\n");
// 	web3.eth.sendTransaction({
// 		from: acctSender, 
// 		to: contractAddr, 
// 		value: web3.utils.toWei(amt, 'ether'), 
// 		gasLimit: 21000, 
// 		gasPrice: 20000000000
// 	});

// 	// console.log("balances after tx:");
// 	// console.log("acctSender\t\t", (acctSender), "\nbalance:\t", chalk.green(getBalance(acctSender)), "\n");
// 	// console.log("destAcct\t\t", (destAcct), "\nbalance:\t", chalk.green(getBalance(destAcct)), "\n");
// 	// console.log("contractAddr\t\t", (contractAddr), "\nbalance:\t", chalk.green(getBalance(contractAddr)), "\n");


// };
// // process.exit();




