import { ethers, network } from "hardhat";
import {
   FUNC_SIGNATURE,
  PROPOSAL_DESCRIPTION,
  MIN_DELAY,
  developmentChains,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/moveBlocks";
import { moveTime } from "../utils/moveTime";

export async function queueAndExecute() {
  const functionToCall = FUNC_SIGNATURE;
  const treasury = await ethers.getContract("Treasury");
  const encodedFunctionCall = treasury.interface.encodeFunctionData(functionToCall);
  const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION));

  const governor = await ethers.getContract("GovernorContract");
  console.log("Queueing...");
  const queueTx = await governor.queue([treasury.address], [0], [encodedFunctionCall], descriptionHash);
  await queueTx.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }

  console.log("Executing...")
  const executeTx = await governor.execute(
    [treasury.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await executeTx.wait(1);
  console.log(`Treasury is executed: ${await treasury.isReleased()}`);
  console.log(`Treasury has transfered this amount of funds: ${await treasury.totalFunds()}`);
}

queueAndExecute()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })