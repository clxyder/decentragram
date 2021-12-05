# Code an Instagram Clone with Blockchain - Ethereum, Solidity, Web3.js, React

This project is based on DappUniversity's [Decentagram YouTube Tutorial](https://youtu.be/8rhueOcTu8k).

## Connecting Ganache to MetaMask

We first need to import our Ganache private keys to MetaMask so we can interact with the local Ganache blockchain instance.

### Setup Custom RPC

* Name: Ganache Testnet
* RPC URL: <http://127.0.0.1:7545>
* ChainId: 1337
* Currency Symbol: ETH

### Import Private Key from the Ganache GUI

1. Copy private key from Ganache GUI
2. Click on Accounts button
3. Import account
4. Paste private key obtained

## Getting started

### Run web server

Boots up the web server:

`npm run start`

### Run tests with Truffle

Runs through the tests outlined `test/test.js`:

`truffle test`

### Migrate contract to ganache blockchain

When the Solidity contract is updated please migrate it to the Ganache chain with the follow command:

`truffle migrate --reset`

## Resources

* [Truffle with MetaMask](https://www.trufflesuite.com/docs/truffle/getting-started/truffle-with-metamask)
* [replacing window web3](https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3)
* [dappuniversity decentragram](https://github.com/dappuniversity/decentragram)
