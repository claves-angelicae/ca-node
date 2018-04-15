//simplesend

pragma solidity ^0.4.13;
contract Sender {

  address public buyer;
  address public DestAddress;
//   address private last;

  
  function Escrow(address _DestAddress) public {
    buyer = msg.sender;
    DestAddress = _DestAddress;
  }

  function payoutToSeller() public{
     address thisAddress = this;
     
     DestAddress.transfer(thisAddress.balance);
  }

  
  function getBalance()public constant returns (uint)  {
    address thisAddress = this;
    return thisAddress.balance;
  }

}