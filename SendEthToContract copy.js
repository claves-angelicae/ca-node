var Web3 = require("web3");
var solc = require('solc')
var fs = require('fs')
const chalk = require('chalk');

// connect to ganache
const netAddr = "http://127.0.0.1:8545";
var web3 = new Web3(new Web3.providers.HttpProvider(netAddr));

var getBalance = async (address) => {
	const balance = await web3.eth.getBalance(address);
	return web3.utils.fromWei(balance, "ether")
};

(async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);
  // const balance = await web3.eth.getBalance(accounts[0]);
  // console.log("balance", web3.utils.fromWei(balance, "ether"));

  getBalance(accounts[2]).then(function(result){
  	console.log(result);
  });

  sendEth(accounts[2], accounts[4]);

})();


var sendEth = function(addr1, addr2){
	console.log(addr1, addr2);

	let acctSender = addr1;
	let destAcct = addr2;
	let contractAddr = "0xd33bcece191dcb95517e8bc21b7d62f4c8c5dcb3";
	let amt = 3.0; // 3 eth

	// console.log("balances before tx:");
	// console.log("acctSender\t\t", (acctSender), "\nbalance:\t", chalk.green(getBalance(acctSender)), "\n");
	// console.log("destAcct\t\t", (destAcct), "\nbalance:\t", chalk.green(getBalance(destAcct)), "\n");
	// console.log("contractAddr\t\t", (contractAddr), "\nbalance:\t", chalk.green(getBalance(contractAddr)), "\n");

	// console.log(chalk.cyan("attempting to send ") + amt + " ETH from " + acctSender + chalk.cyan(" to ") + contractAddr );

	console.log(chalk.cyan("sending " + amt + " ETH from ") + (acctSender) + chalk.cyan(" to ") + (contractAddr) + "\n");
	web3.eth.sendTransaction({
		from: acctSender, 
		to: contractAddr, 
		value: web3.utils.toWei(amt, 'ether'), 
		gasLimit: 21000, 
		gasPrice: 20000000000
	});

	// console.log("balances after tx:");
	// console.log("acctSender\t\t", (acctSender), "\nbalance:\t", chalk.green(getBalance(acctSender)), "\n");
	// console.log("destAcct\t\t", (destAcct), "\nbalance:\t", chalk.green(getBalance(destAcct)), "\n");
	// console.log("contractAddr\t\t", (contractAddr), "\nbalance:\t", chalk.green(getBalance(contractAddr)), "\n");


};
// process.exit();




