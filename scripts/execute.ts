import { ethers, network } from "hardhat";
import {
   FUNC_SIGNATURE,
  PROPOSAL_DESCRIPTION
} from "../helper-hardhat-config";

export async function execute() {
  const treasury = await ethers.getContract("Treasury");
  const encodedFunctionCall = treasury.interface.encodeFunctionData(FUNC_SIGNATURE);
  const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION));
  const governor = await ethers.getContract("GovernorContract");

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

execute()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })