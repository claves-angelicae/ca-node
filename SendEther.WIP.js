#!/usr/bin/env node



if (!process.argv[4]) {
	console.log("Usage: ./SendEther.js <from_address> <dest_address> <ether_amt>");
	process.exit();
}

let fromAddress = process.argv[2];
let destAddr = process.argv[3];
let amt = process.argv[4];

require('dotenv').config()
const config = require('./config').config;
var Web3 = require("web3");
const EthereumTx = require('ethereumjs-tx');
var fs = require('fs')
const log = require('ololog').configure({ time: true })
const ansi = require('ansicolor').nice


log(fromAddress, destAddr, amt);

// connect to network
const netAddr = config.ethNode;
var web3 = new Web3(new Web3.providers.HttpProvider(netAddr));

const logAccountBalances = async (fromAddress, destAddr) => {

	let fromBalanceWei = await web3.eth.getBalance(fromAddress)
  let fromBalance = web3.utils.fromWei(fromBalanceWei, 'ether')
  log("FROM wallet balance is", `${fromBalance} ETH`.green)

	let destBalanceWei = await web3.eth.getBalance(destAddr)
  let destBalance = web3.utils.fromWei(destBalanceWei, 'ether')
  log("DEST wallet balance is", `${destBalance} ETH`.green)

};

// main program
const main = async () => {

	await logAccountBalances(fromAddress, destAddr);

	log("sending", `${amt} ether`.green);

	let gasPrice = await web3.eth.getGasPrice();
	let gas = 21000;
	let gasLimit = gas;

  // create transaction
  const tx = new EthereumTx({
  	from: fromAddress,
    to : destAddr,
		value: web3.utils.toHex(web3.utils.toWei(amt, 'ether')), 
		gas: web3.utils.toHex(gas), 
		gasLimit: web3.utils.toHex(gasLimit), 
		gasPrice: web3.utils.toHex(gasPrice),    
    chainId : 4 // EIP 155 chainId - mainnet: 1, rinkeby: 4
  })

  // // Authorize transaction with private key
  // tx.sign( Buffer.from(ELEMENT.private_key, 'hex') );
  console.log(tx.from)
 process.exit();	

	let txId = await web3.eth.sendTransaction(tx.serialize())
	.once('transactionHash', function(hash){ 
    log("tx", hash.cyan);
    // Build the public Etherscan url with the tx hash
    const url = `https://rinkeby.etherscan.io/tx/${hash}`
    log(url.cyan)
  })
  .once('receipt', function(receipt){ 
    log(receipt);
  })
  .on('confirmation', function(confNumber, receipt){ 
    log(confNumber, receipt);
  })
  .on('error', function(error){ 
    log(error);
  })
  .then(function(receipt){
    // will be fired once the receipt its mined
    log(receipt);
  });	

  log(txId);

	 process.exit()
}

main()
