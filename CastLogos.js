#!/usr/bin/env node

if (!process.argv[3] || (
  process.argv[2] !== "air" &&
  process.argv[2] !== "fire" &&
  process.argv[2] !== "water" &&
  process.argv[2] !== "earth" )) {
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

// Set the web3 default account to the element wallet address used for authoring transactions
web3.eth.defaultAccount = ELEMENT.wallet;

// main program
const main = async () => {

  // With every new transaction sent using a specific wallet address,
  // increase the nonce that's tied to the sender wallet.
  let nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount)
  log(`The outgoing transaction count for your wallet address is: ${nonce}`.magenta)

  // get wallet balance before sending
  let myBalanceWei = await web3.eth.getBalance(web3.eth.defaultAccount)
  let myBalance = web3.utils.fromWei(myBalanceWei, 'ether')
  log(_element.bgBlue, "Wallet balance is currently", `${myBalance} ETH`.green)

  // create transaction
  const tx = new EthereumTx({
    to : ELEMENT.dest_wallet,
    nonce : nonce,
    data : _logosString,
    chainId : config.chainId // EIP 155 chainId - mainnet: 1, rinkeby: 4
  })

  // estimate actual gas with the serialized tx data and destination
  var estimateGas = await web3.eth.estimateGas({
    to: ELEMENT.dest_wallet, 
    data: '0x' + tx.serialize().toString('hex')
  });

  // calculate gas price and minus it from the total balance of the wallet
  var gasPrice = await web3.eth.getGasPrice();
  var gasLimit = new BigNumber(estimateGas + 1000);
  var cost = new BigNumber(gasPrice).multipliedBy(gasLimit);
  var maxValue = new BigNumber(myBalanceWei).minus(cost);

  tx.gas = web3.utils.toHex(estimateGas); // set gas in the tx based on estimated gas calcuation
  tx.value = web3.utils.toHex(maxValue);
  tx.gasPrice = web3.utils.toHex(gasPrice);
  tx.gasLimit = web3.utils.toHex(gasLimit);

  log("Transfering ", web3.utils.fromWei(maxValue.toString(), 'ether').green, "ETH".green, "to", ELEMENT.dest_wallet.yellow)
  log("With an estimated", estimateGas.toString().green, "gas, and ", gasLimit.toString().green, "gas limit")

  // Authorize transaction with private key
  tx.sign( Buffer.from(ELEMENT.private_key, 'hex') );

  // determine the "from" address based on the private key (feature of web3)
  const addr = tx.from.toString('hex')
  log("Based on the private key, the", _element.bgBlue, "address is", addr.yellow)

  // compress the transaction info down into a transportable object.
  const serializedTx = tx.serialize();    

  // submit the raw transaction details
  const transactionId = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
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

  log(`Note: please allow for 30 seconds before transaction appears on Etherscan`.magenta)

  log("All done. Ctrl-c to exit.")
  process.stdin.resume();
  //process.exit()
}

main()