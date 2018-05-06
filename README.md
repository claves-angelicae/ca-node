# ca-node

Claves Angelicae Ethereum contract deployment and interaction server. This software
does the following:

  - Compiles Contracts
  - Deploys Contracts
  - Interacts with Contracts
  - Casts values to contracts from CA Installation

## Compiling Contracts

Contracts are located in `./contracts`. To compile a contract, run

    ./contracts/compile.sh <contract.sol>

The compiled .abi and .bin files are generated in `./build/`.

## Deploying Contracts

    ./contracts/deploy.js <contract owner 0xfff....> <contract.bin> <contract.abi>


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

