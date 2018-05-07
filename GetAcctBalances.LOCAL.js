#!/usr/bin/env node

var Web3 = require("web3");

const netAddr = "http://127.0.0.1:8545"; // connect to ganache
var web3 = new Web3(new Web3.providers.HttpProvider(netAddr));

/*
(async () => {
  
  const accounts = await web3.eth.getAccounts();

  for (var i in accounts) {
    let acct = accounts[i];
    const balance = await web3.eth.getBalance(acct);
    console.log(acct, "balance:", web3.utils.fromWei(balance, "ether"));    
  }

})();
*/

function checkAllBalances() {
  web3.eth.getAccounts(function(err, accounts) {
   accounts.forEach(function(id) {
    web3.eth.getBalance(id, function(err, balance) {
     console.log("" + id + "\tbalance: " + web3.utils.fromWei(balance, "ether") + " ether");
   });
  });
 });
};

checkAllBalances();