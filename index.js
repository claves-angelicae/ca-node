var Web3 = require("web3");
var solc = require('solc')


// var BC = new Web3("HTTP://127.0.0.1:7545");

var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

// console.log(BC);

// console.log(BC.eth.accounts);

// BC.eth.accounts.create(BC.utils.randomHex(32));

web3.fromWei(web3.eth.getBalance(web3.eth.accounts[0])).toNumber()

var acct1 = web3.eth.accounts[0];
var acct2 = web3.eth.accounts[1];
var acct3 = web3.eth.accounts[2];

var balance = (acct) => {
	return web3.fromWei( web3.eth.getBalance(acct), 'ether').toNumber()
};

web3.eth.sendTransaction({from:acct1, to:acct2, value: web3.toWei(1,'ether'), gasLimit:21000, gasPrice: 20000000000})

// web3.eth.sendTransaction({from:acct1, to:acct2, value: web3.toWei(1,'ether')});

// console.log( balance(acct2) );


fs = require('fs')
fs.readFile('simplesend.sol', 'utf8', function (err,data) {
  
  if (err) {
    return console.log(err);
  }

	var compiled = solc.compile(data);

	console.log(compiled.contracts[':Sender'].bytecode);

	var bytecode = compiled.contracts[':Sender'].bytecode;
	var abi = JSON.parse(compiled.contracts[':Sender'].interface)

	 console.log(abi);

	//Set contract factory
	var escrowContract = web3.eth.contract(abi);

	var deployed = escrowContract.new(acct1, acct3, {
	 	from: acct2,
	 	data: bytecode,
	 	gas: .1,
	 	gasPrice: 5
	  	// value: web3.toWei(5, 'ether')
	});

	  // , (error, contract) => {

	  // 	console.log("New Contract  : " +  contract);//deployed.address);

	  //  })

	  console.log(deployed.address);

});


// BC.eth.sendTransaction({from: '0xe5b6E5de77c3c792EA47B8d7a23856a97bde73c0', value: 1000000000, to: '0x70B75a5E46388984b66D3741c84602530Cf599fA'})
// .once('transactionHash', function(hash){ 
// 	console.log('TXHASH' + hash)
//  })
// .once('receipt', function(receipt){ 

// 	console.log(receipt);
//  })
// .on('confirmation', function(confNumber, receipt){ 
// 	console.log(confNumber);
// 	console.log(receipt);
//  })
// .on('error', function(error){ 
// 	console.log(error);
//  })
// .then(function(receipt){
//     console.log(receipt);
// });