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

/**
 * Require the credentials in .env file
 */
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

// Change the provider that is passed to HttpProvider to `mainnet` for live transactions. 
const web3 = new Web3( new Web3.providers.HttpProvider(config.ethNode) )

// Set the web3 default account to use as your public wallet address
// web3.eth.defaultAccount = process.env.WALLET_ADDRESS;
web3.eth.defaultAccount = ELEMENT.wallet;


// This is the process that will run when you execute the program.
const main = async () => {

  /**
   * With every new transaction you send using a specific wallet address,
   * you need to increase a nonce which is tied to the sender wallet.
   */
  let nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount)
  log(`The outgoing transaction count for your wallet address is: ${nonce}`.magenta)

  /**
   * Fetch your personal wallet's balance
   */
  let myBalanceWei = await web3.eth.getBalance(web3.eth.defaultAccount)
  let myBalance = web3.utils.fromWei(myBalanceWei, 'ether')

  log(`Your wallet balance is currently ${myBalance} ETH`.green)

  /**
   * Build a new transaction object and sign it locally.
   */
  let details = {
    to : ELEMENT.dest_wallet,
    // value : web3.utils.toHex(maxValue),
    // gasPrice: web3.utils.toHex(gasPrice),
    // gasLimit: web3.utils.toHex(gasLimit),
    nonce : nonce,
    data : "sdfsfsdf sdf sdf sdf sdf sdf sdf sdf sdf asdf asdf asdf asdf asdf asdf asdf asdf dsf dfd fd fdsf sdf sdfsdfsdf sdf sdf sdf sdf sdf sdf sdf sdf sdf sdf sdf sdf sdf sdf sdf sdf sdfsd fsdf asdf asdf asdf asdf asdf asdfasdfasdfasdfasdfasdf asdf asdf asdf ",
    chainId : 4 // EIP 155 chainId - mainnet: 1, rinkeby: 4
  }

  const transaction = new EthereumTx(details);

  /**
   * This is where the transaction is authorized on your behalf.
   * The private key is what unlocks your wallet.
   */  
  transaction.sign( Buffer.from(ELEMENT.private_key, 'hex') );

  /**
   * Now, we'll compress the transaction info down into a transportable object.
   */
  const serializedTransaction = transaction.serialize()

  /**
   * Note that the Web3 library is able to automatically determine the "from" address based on your private key.
   */
  const addr = transaction.from.toString('hex')
  log(`Based on your private key, your wallet address is ${addr}`)

  // estimate the amount of gas for the transaction
  var estimatedGas = await web3.eth.estimateGas({
    to: ELEMENT.dest_wallet,
    data: "0x" + serializedTransaction.toString('hex')
  });

  // console.log(await web3.eth.getBlock("latest"));
  // process.exit();

  var gasPrice = new BigNumber(await web3.eth.getGasPrice());
  var gasLimit = new BigNumber(parseInt(estimatedGas * 1.5));
  var cost = gasPrice.multipliedBy(gasLimit);
  var maxValue = new BigNumber(myBalanceWei).minus(cost);  

  transaction.gas = web3.utils.toHex(new BigNumber(parseInt(estimatedGas * 1.1)));
  transaction.value = web3.utils.toHex(maxValue);
  transaction.gasPrice = web3.utils.toHex(gasPrice);
  transaction.gasLimit = web3.utils.toHex(gasLimit);

  // console.log(transaction.gasLimit);
  // console.log(estimatedGas);
  // console.log(gasLimit.toNumber());
  // process.exit();

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