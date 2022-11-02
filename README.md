# DAO

## Usage

### On-Chain Governance Example

Here is the rundown of what the test suite does.

1. We will deploy an ERC20 token that we will use to govern our DAO.
2. We will deploy a Timelock contract that we will use to give a buffer between executing proposals.
   1. Note: **The timelock is the contract that will handle all the money, ownerships, etc**
3. We will deploy our Governence contract
   1. Note: **The Governance contract is in charge of proposals and such, but the Timelock executes!**
4. We will deploy a simple Treasury contract, which will be owned by our governance process.
5. We will propose an account to send ether to with the initialization of the contract.
6. We will then vote on that proposal.
7. We will then queue the proposal to be executed.
8. Then, we will execute it!

How you can deploy & run scripts:

1. Setup local blockchain
2. Propose a new value to be added to our Box contract
3. Vote on that proposal
4. Queue & Execute proposal!

## Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- [Nodejs](https://nodejs.org/en/)
  - You'll know you've installed nodejs right if you can run:
    - `node --version`and get an ouput like: `vx.x.x`
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) instead of `npm`
  - You'll know you've installed yarn right if you can run:
    - `yarn --version` And get an output like: `x.x.x`
    - You might need to install it with npm

### Installation

1. Clone this repo:

```
git clone https://github.com/grc02/DAO
cd DAO
```

2. Install dependencies

```sh
yarn install
```

or

```
npm i
```

3. Run a local hardhat node to deploy all deployment scripts

```
yarn hardhat node
```

4. Run the scripts in the script dir, which interact with the deployed contracts

```
yarn hardhat run scripts/propose.ts --network localhost
yarn hardhat run scripts/vote.ts --network localhost
yarn hardhat run scripts/queue.ts --network localhost
yarn hardhat run scripts/queue.ts --network localhost
```
