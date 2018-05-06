#!/usr/bin/env node

if (!process.argv[5]) {
  console.log("Usage: ./DeployContract.js <contract.abi> <contract.bin> <destination address> <element string>");
  process.exit();
}

var _contractABI  = process.argv[2];
var _contractBIN  = process.argv[3];
var _contractDest = process.argv[4];
var _contractElement = process.argv[5];


/**
 * Require the credentials that you entered in the .env file
 */
require('dotenv').config()

const config = require('./config').config;
const Web3 = require('web3')
const fs = require("fs")
const axios = require('axios')
const EthereumTx = require('ethereumjs-tx')
const log = require('ololog').configure({ time: true })
const ansi = require('ansicolor').nice


/**
 * Change the provider that is passed to HttpProvider to `mainnet` for live transactions.
 */
const web3 = new Web3( new Web3.providers.HttpProvider(config.ethNode) )

/**
 * Set the web3 default account to use as your public wallet address
 */
web3.eth.defaultAccount = process.env.WALLET_ADDRESS;

/**
 * The amount of ETH you want to send in this transaction
 * @type {Number}
 */
const amountToSend = '1.0'

/**
 * Fetch the current transaction gas prices from https://ethgasstation.info/
 * 
 * @return {object} Gas prices at different priorities
 */
const getCurrentGasPrices = async () => {
  let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
  let prices = {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10
  }

  console.log("")
  log (`Current ETH Gas Prices (in GWEI):`.cyan)
  console.log("")
  log(`Low: ${prices.low} (transaction completes in < 30 minutes)`.green)
  log(`Standard: ${prices.medium} (transaction completes in < 5 minutes)`.yellow)
  log(`Fast: ${prices.high} (transaction completes in < 2 minutes)`.red)
  console.log("")

  return prices
}


/**
 * This is the process that will run when you execute the program.
 */
const main = async () => {

  /**
   * Fetch your personal wallet's balance
   */
  let myBalanceWei = await web3.eth.getBalance(web3.eth.defaultAccount)
  let myBalance = web3.utils.fromWei(myBalanceWei, 'ether')

  log(`Your wallet balance is currently ${myBalance} ETH`.green)

  /**
   * With every new transaction you send using a specific wallet address,
   * you need to increase a nonce which is tied to the sender wallet.
   */
  let nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount)
  log(`The outgoing transaction count for your wallet address is: ${nonce}`.magenta)

  /**
   * Fetch the current transaction gas prices from https://ethgasstation.info/
   */
  let gasPrices = await getCurrentGasPrices()


  // ABI description as JSON structure
  let abi = JSON.parse(fs.readFileSync(_contractABI));

  // Smart contract EVM bytecode as hex
  let bin = fs.readFileSync(_contractBIN)

  // Create Contract proxy class
  let ElementContract = new web3.eth.Contract(abi);

  /**
   * Build a new transaction object and sign it locally.
   */
  let details = {
    to : process.env.DESTINATION_WALLET_ADDRESS,
    value : 0,
    gas : 300000,
    gasPrice : gasPrices.low * 1000000000, // converts the gwei price to wei
    nonce : nonce,
    data : "here's some data",
    chainId : 4 // EIP 155 chainId - mainnet: 1, rinkeby: 4
  }

  const transaction = new EthereumTx(details)

  /**
   * This is where the transaction is authorized on your behalf.
   * The private key is what unlocks your wallet.
   */
  transaction.sign( Buffer.from(process.env.WALLET_PRIVATE_KEY, 'hex') )

  /**
   * Now, we'll compress the transaction info down into a transportable object.
   */
  const serializedTransaction = transaction.serialize()

  /**
   * Note that the Web3 library is able to automatically determine the "from" address based on your private key.
   */
  const addr = transaction.from.toString('hex')
  log(`Based on your private key, your wallet address is ${addr}`)

  /**
   * We're ready! Submit the raw transaction details to the provider configured above.
   */
  const transactionId = await web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
  .once('transactionHash', function(hash){ 
    log(hash);
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

  /**
   * We now know the transaction ID, so let's build the public Etherscan url where
   * the transaction details can be viewed.
   */

  log(`Note: please allow for 30 seconds before transaction appears on Etherscan`.magenta)

  process.exit()
}

main()


