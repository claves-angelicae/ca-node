pragma solidity ^0.4.11;

contract Element {  
    
  address public dest;
  string public logos;
  
  event LogInit(address _dest);
  event LogWithdrawal(address _from, uint _amount);
  event LogSetLogos(string _logos);
  event LogSetDestination(address _dest);
  event LogPayin(address _from, uint _amount);
  
  constructor (address _dest) public {
    dest = _dest;
    emit LogInit(_dest);
  }
  
  function cast(string _logos) public {
    logos = _logos;
    emit LogSetLogos(_logos);
  } 
  
  function setDestination (address _dest) public {
    dest = _dest;
    emit LogSetDestination(_dest);
  }
  
  function() payable public {
    emit LogPayin(msg.sender, msg.value);
    dest.transfer(msg.value);
  }
}
