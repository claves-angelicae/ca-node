#!/usr/bin/env node

if (!process.argv[5]) {
  console.log("Usage: node CastToContract.js <sender address> <contract address> <contract.abi> \"logos string\"");
  process.exit();
}

var _senderAddress = process.argv[2];
var _contractAddress = process.argv[3];
var _contractABIFile = process.argv[4];
var _logosStr = process.argv[5];

var config = require('./config').config;
var Web3 = require("web3");
var solc = require('solc')
var fs = require('fs')
const chalk = require('chalk');

// connect to eth node
var web3 = new Web3(new Web3.providers.HttpProvider(config.ethNode));

// parse abi json
let abi = JSON.parse(fs.readFileSync(_contractABIFile));

// create contract instance
const ElementContract = new web3.eth.Contract(abi, _contractAddress);

// call the contract and see what the current logos string is
ElementContract.methods.logos().call(function(error, result) {
  
  console.log("Current LOGOS is:", chalk.green(result));

  // cast new logos string
  ElementContract.methods.cast(_logosStr).send({ 
    "from": _senderAddress 
  }, function(error, result) {
    
    console.log("Setting new LOGOS string to", chalk.green(_logosStr));
    console.log("tx", chalk.yellow(result));

    // check what the new string is
    ElementContract.methods.logos().call(function(error, result) {
      console.log("LOGOS is now:", chalk.green(result));      
    });

  });  
});
