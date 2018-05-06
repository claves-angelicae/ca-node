pragma solidity ^ 0.4.11;

contract Element {

  address public owner;  // address of the contract creator
  address public dest;   // address of the destination for casting
  string public element; // element of the contract
  string public logos;   // logos string

  event LogInit(string _element, address _dest);
  event LogWithdrawal(address _from, uint _amount);
  event LogSetLogos(string _logos);
  event LogSetDestination(address _dest);
  event LogPayin(address _from, uint _amount);

  constructor(string _element, address _dest) public {
    owner = msg.sender; // set owner to be contract creator
    element = _element; // set element -- immutable
    dest = _dest; // set destination address -- mutable with setDestination()
    emit LogInit(_element, _dest); // log the contract creation
  }

  function cast(string _logos) public {
    if (msg.sender == owner) { // only allow logos string to be set by contract owner
      logos = _logos; // set logos string
      dest.transfer(
          address(this).balance); // transfer contract balance to destination
      emit LogSetLogos(_logos); // log the event
    }
  }

  function setDestination(address _dest) public {
    if (msg.sender == owner) { // only allow destination address to be set by contract creator
      dest = _dest; // set destination address
      emit LogSetDestination(_dest); // log the event
    }
  }

  function kill() public {
    if (msg.sender == owner) { // only allow contract owner to kill the contract
      selfdestruct(dest); // send all remaining eth to destination
    }
  }

  function() payable public {
    emit LogPayin(msg.sender,
                  msg.value); // log eth transaction when wallet is paid into
  }
}
