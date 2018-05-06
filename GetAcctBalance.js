#!/usr/bin/env node

var config = require('./config').config;

if (!process.argv[2]) {
  console.log("Usage: ./GetAcctBalance.js <address>");
  process.exit();
}

var address = process.argv[2];

var Web3 = require("web3");

const netAddr = config.ethNode;
var web3 = new Web3(new Web3.providers.HttpProvider(netAddr));

web3.eth.getBalance(address, function(err, balance) {
 console.log("" + address + "\tbalance: " + web3.utils.fromWei(balance, "ether") + " ether");
});
