# Zapper-API-Stack
This repo demonstrates usage of the Zapper API using Web3 and Smart Contracts

See https://docs.zapper.fi/zapper-api/api-guides for additional context

## Setup
1. Clone this repository
2. cd into the cloned folder
3. Run the command `yarn` to install dependencies 

## Testing
1. Run the command `yarn test`

## Explanation
This repo includes a contract called `ZapConsumer.sol` which demonstrates how to consume Zapper Transaction API data in a smart contract.  

The `test` folder contains tests demonstrating the usage of the `ZapConsumer.sol` contract as well as examples of how to consume transaction data with vanilla Web3.

The `api` folder contains example utility functions for calling the Zapper API with Axios via GET requests.

NOTE: An example of `.env` is provided as `.env.example`. You must create a `.env` after cloning this repository.
