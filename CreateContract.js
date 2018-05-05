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

var isAddress = (address) => {
	return web3.isAddress(address);
};


var _dest = web3.eth.accounts[1];
var simplesendContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"value","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dest","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_logos","type":"string"}],"name":"cast","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_dest","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_dest","type":"address"}],"name":"Init","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_logos","type":"string"}],"name":"LogSetLogos","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"LogWithdrawal","type":"event"}]);
var simplesend = simplesendContract.new(
   _dest,
   {
     from: web3.eth.accounts[0], 
     data: '0x6060604052341561000f57600080fd5b6040516020806103df8339810160405280805190602001909190505080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507f4f8cfde3439a1a302c21ca51eec26086efbfd940b8c0279889fc6bb6e73ecc6681604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a150610300806100df6000396000f300606060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633fa4f2451461012f57806384b366dc14610158578063d78385fc146101ad575b346000819055507fb4214c8c54fc7442f36d3682f59aebaf09358a4431835b30efb29d52cf9e1e913334604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a1600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6000549081150290604051600060405180830381858888f19350505050151561012d57600080fd5b005b341561013a57600080fd5b61014261020a565b6040518082815260200191505060405180910390f35b341561016357600080fd5b61016b610210565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156101b857600080fd5b610208600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610236565b005b60005481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b7ef26701161bb62a3f059912e12061cf737d15470035352eac6784fb042f0a35816040518080602001828103825283818151815260200191508051906020019080838360005b8381101561029757808201518184015260208101905061027c565b50505050905090810190601f1680156102c45780820380516001836020036101000a031916815260200191505b509250505060405180910390a1505600a165627a7a72305820083e598a0ce1f1336a6af7e34dd8cb64ddb8d5cd70d4240d7d6fab6ae0590bcc0029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 });
