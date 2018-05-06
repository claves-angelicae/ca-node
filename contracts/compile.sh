#!/bin/sh

# solcjs $1 --combined-json abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc > $2
: ${1?"Usage: $0 <contract.sol>"}

solcjs -o ./build --bin --abi $1
