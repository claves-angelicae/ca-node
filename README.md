# ca-node

Claves Angelicae Ethereum contract deployment and interaction server. This software
does the following:

  - Compiles Contracts
  - Deploys Contracts
  - Interacts with Contracts
  - Casts values to contracts from CA Installation

## Compile Contract

Contracts are located in `./contracts`. To compile a contract, run

    ./contracts/compile.sh <contract.sol>

The compiled .abi and .bin files are generated in `./build/`.

## Deploy Contract

    ./contracts/deploy.js <contract owner address> <contract.bin> <contract.abi>

## Cast LOGOS to contract

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
