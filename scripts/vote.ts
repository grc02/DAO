import * as fs from "fs";
import { network, ethers } from "hardhat";
import { proposalFile, developmentChains, VOTING_PERIOD } from "../helper-hardhat-config";
import { moveBlocks } from "../utils/moveBlocks";


async function vote() {
  const proposals = JSON.parse(fs.readFileSync(proposalFile, "utf8"));
  // Get the last proposal for the network. You could also change it for your index
  const proposalId = proposals[network.config.chainId!].at(-1);;
  // 0 = Against, 1 = For, 2 = Abstain for this example
  const voteWay = 1;
  const reason = "...";
  
  console.log("Voting...");
  const governor = await ethers.getContract("GovernorContract");
  const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason);
  const voteTxReceipt = await voteTx.wait(1);
  console.log(voteTxReceipt.events[0].args.reason);
  const proposalState = await governor.state(proposalId);
  console.log(`Current Proposal State: ${proposalState}`)
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
}

vote()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })