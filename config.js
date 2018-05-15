require('dotenv').config()

module.exports = {
  config: {
      // ethNode : 'http://localhost:8545' 
      //ethNode : `https://rinkeby.infura.io/${process.env.INFURA_ACCESS_TOKEN}`, chainId : 4
      ethNode : `https://mainnet.infura.io/${process.env.INFURA_ACCESS_TOKEN}`, chainId : 1 // mainnet
  }
};