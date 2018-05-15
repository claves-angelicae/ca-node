#!/usr/bin/env node

console.log(process.argv);

require('dotenv').config()
var config = require('./config').config;
var Web3 = require("web3");

const __main = async () => {

  var web3 = new Web3(new Web3.providers.HttpProvider(config.ethNode));
  web3.eth.net.getNetworkType().then(console.log);
  // our code goes here
  process.stdin.resume();
}

__main();