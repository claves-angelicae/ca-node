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

// var elementContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"_dest","type":"address"}],"name":"setDestination","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"value","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dest","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"logos","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_logos","type":"string"}],"name":"cast","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_dest","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_dest","type":"address"}],"name":"LogInit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"LogWithdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_logos","type":"string"}],"name":"LogSetLogos","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_dest","type":"address"}],"name":"LogSetDestination","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"LogPayin","type":"event"}]);

let acctSender = web3.eth.accounts[1];
let destAcct = "0x147029a6f932bdd20b4a517736d5b480875c401c";
let contractAddress = "0x933227d4c033daf6549917784f1ae9736c55559c";
let amt = 3.0; // 3 eth

// var sourceCode = fs.readFileSync('sol/Element.sol','utf8')
// var compiled = solc.compile(sourceCode);
// var abiArray = compiled.contracts[":Element"].interface;
// abiArray = JSON.parse(abiArray);
var contractAbi = [{"constant":false,"inputs":[{"name":"_dest","type":"address"}],"name":"setDestination","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"dest","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"logos","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_logos","type":"string"}],"name":"cast","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_dest","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_dest","type":"address"}],"name":"LogInit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"LogWithdrawal","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_logos","type":"string"}],"name":"LogSetLogos","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_dest","type":"address"}],"name":"LogSetDestination","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"LogPayin","type":"event"}];

const ContractInstance = new web3.eth.Contract(contractAbi, contractAddress);
// const contractInstance = contract.at(contractAddress);

var newLogos = "sfsfsfsf s s s s s s s";

ContractInstance.methods.logos().call(function(error, result) {
  
  console.log("Current LOGOS is:", chalk.green(result));

  ContractInstance.methods.cast(newLogos).send({ "from": destAcct }, function(error, result) {
    
    console.log("Setting new LOGOS string to", chalk.green(newLogos));
    console.log("tx", chalk.yellow(result));

    ContractInstance.methods.logos().call(function(error, result) {
      console.log("LOGOS is now:", chalk.green(result));      
    });

  });
  
});

// ContractInstance.methods.cast('sup sup sup sup').send({ "from": destAcct }, function(error, result){
//     console.log(error, result);
// });

// ContractInstance.methods.logos().call(function(error, result) {
//   console.log(error, result);
// });