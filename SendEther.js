#!/usr/bin/env node

var config = require('./config').config;

if (!process.argv[4]) {
	console.log("Usage: ./SendEther.js <from_address> <dest_address> <ether_amt>");
	process.exit();
}

let fromAddress = process.argv[2];
let destAddr = process.argv[3];
let amt = process.argv[4];

var Web3 = require("web3");
var fs = require('fs')
const chalk = require('chalk');

// connect to network
const netAddr = config.ethNode;
var web3 = new Web3(new Web3.providers.HttpProvider(netAddr));

console.log("sending\t\t", chalk.green(amt + " ether"));

web3.eth.getBalance(destAddr, function(err, balance) {

	console.log("destAddr balance before");
 	console.log(web3.utils.fromWei(balance, "ether") + " ether");

	console.log(chalk.cyan("sending " + amt + " ETH from ") + (fromAddress) + chalk.cyan(" to ") + (destAddr) + "\n");

	web3.eth.sendTransaction({
		from: fromAddress, 
		to: destAddr, 
		value: web3.utils.toWei(amt, 'ether'), 
		gasLimit: 800000, 
		gasPrice: 20000000000
	}); 	

	web3.eth.getBalance(destAddr, function(err, balance) {
		console.log("destAddr balance after");
 		console.log(web3.utils.fromWei(balance, "ether") + " ether");
	});

});
