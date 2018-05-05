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

let acct1 = web3.eth.accounts[0];
let acct2 = web3.eth.accounts[1];



var testSend = (acct1, acct2, amt) => {

	console.log("balances before tx:");
	console.log("acct1\t\t", (acct1), "\nbalance:\t", chalk.green(getBalance(acct1)), "\n");
	console.log("acct2\t\t", (acct2), "\nbalance:\t", chalk.green(getBalance(acct2)), "\n");

	console.log(chalk.cyan("attempting to send ") + amt + " ETH from " + acct1 + chalk.cyan(" to ") + acct2 );
	console.log(chalk.cyan("checking balance of ") + acct1 + ": " + chalk.green(getBalance(acct1)));
	if (getBalance(acct1) < amt) {

		console.log(chalk.red("Not enough ETH to send\n"));

	} else {

		console.log(chalk.cyan("sending " + amt + " ETH from ") + (acct1) + chalk.cyan(" to ") + (acct2) + "\n");
		web3.eth.sendTransaction({
			from: acct1, 
			to: acct2, 
			value: web3.toWei(amt, 'ether'), 
			gasLimit: 21000, 
			gasPrice: 20000000000
		});

	}

	console.log("balances after tx:");
	console.log("acct1\t\t", (acct1), "\nbalance:\t", chalk.green(getBalance(acct1)), "\n");
	console.log("acct2\t\t", (acct2), "\nbalance:\t", chalk.green(getBalance(acct2)), "\n");
}

// if (Web3.utils.isAddress('0xadf2659690d06da887f014311eb58459dfc9745e')) {
// 	console.log("is address");
// }

testSend(acct1, acct2, 0.5);

// process.exit();

// fs.readFile('simplesend.sol', 'utf8', function (err, data) {
  
//   if (err) {
//     return console.log(err);
//   }

// 	var compiled = solc.compile(data);

// 	// console.log(compiled.contracts[':Sender'].bytecode);

// 	var bytecode = compiled.contracts[':Sender'].bytecode;
// 	var abi = JSON.parse(compiled.contracts[':Sender'].interface);

// 	//Set contract factory
// 	var escrowContract = web3.eth.contract(abi);

// 	var deployed = escrowContract.new(acct1, acct3, {
// 	 	from: acct2,
// 	 	data: bytecode,
// 	 	gas: .1,
// 	 	gasPrice: 5
// 	  	// value: web3.toWei(5, 'ether')
// 	});

// 	  // , (error, contract) => {

// 	  // 	console.log("New Contract  : " +  contract);//deployed.address);

// 	  //  })

// 	  console.log(deployed.address);
// });


// BC.eth.sendTransaction({from: '0xe5b6E5de77c3c792EA47B8d7a23856a97bde73c0', value: 1000000000, to: '0x70B75a5E46388984b66D3741c84602530Cf599fA'})
// .once('transactionHash', function(hash){ 
// 	console.log('TXHASH' + hash)
//  })
// .once('receipt', function(receipt){ 

// 	console.log(receipt);
//  })
// .on('confirmation', function(confNumber, receipt){ 
// 	console.log(confNumber);
// 	console.log(receipt);
//  })
// .on('error', function(error){ 
// 	console.log(error);
//  })
// .then(function(receipt){
//     console.log(receipt);
// });