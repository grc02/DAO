import { ethers } from "hardhat";
import { FUNC_SIGNATURE, RECEIVER_OF_FUNDS } from "../helper-hardhat-config";

export async function propose(args: any[], functionToCall: string, proposalDescription: string) {
   const governor = await ethers.getContract("GovernorContract");
   const treasury = await ethers.getContract("Treasury");
   const encodeFunctionCall = await treasury.interface.encodeFunctionData(functionToCall);
   console.log(`Proposing ${functionToCall} on ${treasury.address}`);
   console.log(`Proposal Description:\n  ${proposalDescription}`);
   const proposeTx = await governor.propose(
      [treasury.address],
      [0],
      [encodeFunctionCall],
      proposalDescription
    );
}

propose([], FUNC_SIGNATURE, `Send funds to this address: ${RECEIVER_OF_FUNDS}`)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })