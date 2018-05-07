#!/usr/bin/env node

if (!process.argv[3] || (
  process.argv[2] !== "air" &&
  process.argv[2] !== "fire" &&
  process.argv[2] !== "water" &&
  process.argv[2] !== "earth"
  )) {
  console.log("Usage: ./CastLogos.js <air|fire|water|earth> <logos_string>");
  process.exit();
}

const _element = process.argv[2];
const _logosString = process.argv[3];

// Require the credentials in .env file
require('dotenv').config()
const config = require('./config').config;
const Web3 = require('web3')
const fs = require("fs")
const axios = require('axios')
const BigNumber = require('bignumber.js')
const EthereumTx = require('ethereumjs-tx')
const log = require('ololog').configure({ time: true })
const ansi = require('ansicolor').nice

// get public wallet and keys associated with elements for transactions
const getElementKeys = function(elementName) {
  let env = process.env;
  switch(elementName) {
    case 'air' : 
      return {
        wallet: process.env.AIR_WALLET_ADDRESS,
        private_key: process.env.AIR_PRIVATE_KEY,
        dest_wallet: process.env.AIR_DEST_WALLET_ADDRESS
      }; break;
    case 'fire' : 
      return {
        wallet: process.env.FIRE_WALLET_ADDRESS,
        private_key: process.env.FIRE_PRIVATE_KEY,
        dest_wallet: process.env.FIRE_DEST_WALLET_ADDRESS
      }; break;
    case 'water' : 
      return {
        wallet: process.env.WATER_WALLET_ADDRESS,
        private_key: process.env.WATER_PRIVATE_KEY,
        dest_wallet: process.env.WATER_DEST_WALLET_ADDRESS
      }; break;
    case 'earth' : 
      return {
        wallet: process.env.EARTH_WALLET_ADDRESS,
        private_key: process.env.EARTH_PRIVATE_KEY,
        dest_wallet: process.env.EARTH_DEST_WALLET_ADDRESS
      }; break;
  }
}

const ELEMENT = getElementKeys(_element);

// Change the provider that is passed to HttpProvider to `mainnet` for live transactions. 
const web3 = new Web3( new Web3.providers.HttpProvider(config.ethNode) )

// Set the web3 default account to use as your public wallet address
// web3.eth.defaultAccount = process.env.WALLET_ADDRESS;
web3.eth.defaultAccount = ELEMENT.wallet;


// This is the process that will run when you execute the program.
const main = async () => {

  // With every new transaction you send using a specific wallet address,
  // you need to increase a nonce which is tied to the sender wallet.
  let nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount)
  log(`The outgoing transaction count for your wallet address is: ${nonce}`.magenta)

  // get wallet balance
  let myBalanceWei = await web3.eth.getBalance(web3.eth.defaultAccount)
  let myBalance = web3.utils.fromWei(myBalanceWei, 'ether')

  log(`Wallet balance is currently ${myBalance} ETH`.green)

  var gasPrice = await web3.eth.getGasPrice();
  var gasLimit = new BigNumber(40000);
  var cost = new BigNumber(gasPrice).multipliedBy(gasLimit);
  var maxValue = new BigNumber(myBalanceWei).minus(cost);

  // Build a new transaction object and sign it locally.
  let details = {
    to : ELEMENT.dest_wallet,
    value : web3.utils.toHex(maxValue),
    gasPrice: web3.utils.toHex(gasPrice),
    gasLimit: web3.utils.toHex(gasLimit),
    nonce : nonce,
    data : _logosString,
    chainId : 4 // EIP 155 chainId - mainnet: 1, rinkeby: 4
  }

  // create transaction
  const transaction = new EthereumTx(details)

  // Authorize transaction with private key
  transaction.sign( Buffer.from(ELEMENT.private_key, 'hex') )

  // compress the transaction info down into a transportable object.
  const serializedTransaction = transaction.serialize()

  // estimate actual gas now that the transaction has been signed
  var estimateGas = await web3.eth.estimateGas({
    to: ELEMENT.dest_wallet, 
    data: '0x' + serializedTransaction.toString('hex')
  });

  // set gas based on estimated gas calcuation
  transaction.gas = web3.utils.toHex(estimateGas);

  log("Transfering ", web3.utils.fromWei(maxValue.toString(), 'ether').green, "ETH".green)
  log("With an estimated", estimateGas.toString().green, "gas")

  // Note that the Web3 library is able to automatically determine the "from" address based on your private key.
  const addr = transaction.from.toString('hex')
  log(`Based on your private key, your wallet address is ${addr}`)

  // Submit the raw transaction details to the provider configured above.
  const transactionId = await web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
  .once('transactionHash', function(hash){ 
    log("tx", hash.cyan);
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


  // We now know the transaction ID. Build the public Etherscan url
  log(`Note: please allow for 30 seconds before transaction appears on Etherscan`.magenta)

  process.exit()
}

main()