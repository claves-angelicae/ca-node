#!/usr/bin/env node

var config = require('./config').config;

if (!process.argv[4]) {
	console.log("Usage: ./SendEthToContract.js <contract address> <from address> <eth amt>");
	process.exit();
}

let contractAddr = process.argv[2];
let fromAddress = process.argv[3];
let amt = process.argv[4];

var Web3 = require("web3");
var fs = require('fs')
const chalk = require('chalk');

// connect to network
const netAddr = config.ethNode;
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
