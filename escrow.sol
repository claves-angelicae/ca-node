pragma solidity ^0.4.11;
contract Escrow {

  address public buyer;
  address public seller;
  address public arbiter;
//   address private last;
  
  function Escrow(address _seller, address _arbiter) public {
    buyer = msg.sender;
    seller = _seller;
    arbiter = _arbiter;
    
    
  }
  
//   function sending() public{
//       seller.transfer(100);
//   }

  function payoutToSeller() public{
   
    if(address(msg.sender) == arbiter)  {
      address thisAddress = this;
    //   last = thisAddress;
     seller.transfer(thisAddress.balance);
    }
  }
  
  function refundToBuyer() public{
    if( msg.sender == arbiter)  {
      address thisAddress = this;
      buyer.transfer(thisAddress.balance);
    }
  }
  
  function getBalance()public constant returns (uint)  {
    address thisAddress = this;
    return thisAddress.balance;
  }

}