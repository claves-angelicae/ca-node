# ca-node

Claves Angelicae Ethereum contract deployment and interaction server. This software
contains a number of scripts that do the following:

  - Compiles Contracts
  - Deploys Contracts
  - Interacts with Contracts
  - Posts values to contracts from CA Installation
  - Performs transactions
  - Calculates gas expendatures
  - Get current gas prices on the Ethereum network

## Requirements

Tested with node v9.11.1

## Set up .env file

The .env file must be placed in the root of the project and configured as such:

    INFURA_ACCESS_TOKEN=<infura api toke>

    # clavesangelicae main wallet
    WALLET_ADDRESS=<0x...address>
    WALLET_PRIVATE_KEY=<0x...address>

    # clavesangelicae element wallets
    AIR_WALLET_ADDRESS=<0x...address>
    AIR_PRIVATE_KEY=<0x...address>
    AIR_DEST_WALLET_ADDRESS=<0x...address>

    FIRE_WALLET_ADDRESS=<0x...address>
    FIRE_PRIVATE_KEY=<0x...address>
    FIRE_DEST_WALLET_ADDRESS=<0x...address>

    WATER_WALLET_ADDRESS=<0x...address>
    WATER_PRIVATE_KEY=<0x...address>
    WATER_DEST_WALLET_ADDRESS=<0x...address>

    EARTH_WALLET_ADDRESS=<0x...address>
    EARTH_PRIVATE_KEY=<0x...address>
    EARTH_DEST_WALLET_ADDRESS=<0x...address>

## Set up Config.js

Set the ethNode you want to use. Either a localhost node such as an Ethereum full/lite node, geth, ganache, testnets, or mainnet.

    module.exports = {
      config: {
          // ethNode : 'http://localhost:8545' // local
          // ethNode : `https://rinkeby.infura.io/${process.env.INFURA_ACCESS_TOKEN}`, chainId : 4 // testnet
          ethNode : `https://mainnet.infura.io/${process.env.INFURA_ACCESS_TOKEN}`, chainId : 1 // mainnet
      }
    };  

## Cast Logos with Ether transaction

node: There must be enough Ether in the source account to cover the transaction costs for this transaction to succeed.

    ./CastLogos.js <air|fire|water|earth> <logos_string>

## Get current gas prices on the network

    ./GetGasPrices.js

## Get account balance

    ./GetAcctBalance.js <0x....address>

## Compiling Contracts

Contracts are located in `./contracts`. To compile a contract, run

    ./contracts/compile.sh <contract.sol>

The compiled .abi and .bin files are generated in `./build/`.

## Deploying Contracts

    ./contracts/deploy.js <contract owner address> <contract.bin> <contract.abi>

## Castings LOGOS to contracts

    ./CastToContract.js <sender address> <contract address> <contract.abi> "logos string"

## Reference

  - https://ethereum.stackexchange.com/questions/765/what-is-the-difference-between-a-transaction-and-a-call/770#770
  - https://github.com/ethereum/wiki/wiki/JavaScript-API
  - https://medium.com/crypto-currently/build-your-first-smart-contract-fc36a8ff50ca
  - https://github.com/ethereum/solidity-examples/tree/master/examples
  - https://github.com/eshon/conference/blob/master/contracts/Conference.sol
  - https://ethereumbuilders.gitbooks.io/guide/content/en/solidity_tutorials.html
  - https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/payment/PullPayment.sol
  - https://github.com/TokenMarketNet/ethereum-smart-contract-transaction-demo/tree/master/src
  - https://tokenmarket.net/blog/creating-ethereum-smart-contract-transactions-in-client-side-javascript/
  - https://www.ethereum.org/greeter
  - https://github.com/ethereumjs/ethereumjs-tx/blob/master/examples/transactions.js#L15
  - https://gist.github.com/tomconte/6ce22128b15ba36bb3d7585d5180fba0
  - https://medium.com/@ethgasstation/ethereum-wallets-and-the-problem-of-the-default-gas-price-fe7e55743cb5
  - https://davekiss.com/ethereum-web3-node-tutorial/
  - https://web3js.readthedocs.io/en/1.0/web3-eth.html?highlight=gasPrice#getgasprice
