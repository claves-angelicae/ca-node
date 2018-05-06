#!/usr/bin/env node

var config = require('./../config').get();

if (!process.argv[6]) {
  console.log("Usage: ./deploy.sh <contract.abi> <contract.bin> <owner address> <destination address> <element string>");
  process.exit();
}

var _contractABI = process.argv[2];
var _contractBIN = process.argv[3];
var _contractOwner = process.argv[4];
var _contractDest = process.argv[5];
var _contractElement = process.argv[6];
var _ethNode = config.ethNode;
// var _ethNode = 'https://rinkeby.etherscan.io/';

// console.log(process.argv);
// process.exit();

let fs = require("fs");
let Web3 = require('web3'); 

// Create a web3 connection to a running geth node over JSON-RPC running at
// http://localhost:8545
// For geth VPS server + SSH tunneling see
// https://gist.github.com/miohtama/ce612b35415e74268ff243af645048f4
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(_ethNode));

// Read the compiled contract code
// Compile with ./compile.sh

// ABI description as JSON structure
let abi = JSON.parse(fs.readFileSync(_contractABI));

// Smart contract EVM bytecode as hex
let bin = fs.readFileSync(_contractBIN)

// Create Contract proxy class
let ElementContract = new web3.eth.Contract(abi);

console.log("Deploying the contract");

ElementContract.deploy({
  data: bin,
  arguments: [_contractElement, _contractDest]
})
.send({
  from: _contractOwner,
  gas: 1500000,
  gasPrice: '30000000000000'
}, function(error, transactionHash) {
  if (error) {
    console.log(error);
  }
  console.log(transactionHash); 
})
.on('error', function(error) {
  console.log(error);
})
.on('transactionHash', function(transactionHash) { 
  console.log(transactionHash);   
})
.on('receipt', function(receipt) {
   console.log(receipt.contractAddress) // contains the new contract address
})
.on('confirmation', function(confirmationNumber, receipt) {
  console.log(confirmationNumber, receipt);
})
.then(function(newContractInstance) {
    console.log(newContractInstance.options.address) // instance with the new contract address
});
