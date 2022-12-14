import { ethers, network } from "hardhat";
import { FUNC_SIGNATURE, RECEIVER_OF_FUNDS, developmentChains, VOTING_DELAY, proposalFile } from "../helper-hardhat-config";
import { moveBlocks } from "../utils/moveBlocks";
import * as fs from "fs";

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

   if (developmentChains.includes(network.name)) {
      await moveBlocks(VOTING_DELAY + 1);
   };
   const proposeReceipt = await proposeTx.wait(1);
   const proposalId = proposeReceipt.events[0].args.proposalId;
   console.log(`Proposed with proposal ID: ${proposalId}`);

   let proposals = JSON.parse(fs.readFileSync(`./${proposalFile}`, "utf-8"));
   proposals[network.config.chainId!.toString()].push(proposalId.toString());
   fs.writeFileSync(`./${proposalFile}`, JSON.stringify(proposals));
}

propose([], FUNC_SIGNATURE, `Send funds to this address: ${RECEIVER_OF_FUNDS}`)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  });