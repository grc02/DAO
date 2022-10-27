import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
   QUORUM_PERCENTAGE,
   VOTING_PERIOD,
   VOTING_DELAY,
 } from "../helper-hardhat-config";

const deployGovernor: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments} = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const governanceToken = await get("GovernanceTokenDAO");
  const timeLock = await get("GovernanceTimeLock");
  log("----------------------------------------------------");
  log("Deploying Governor...");
  const governor = await deploy("GovernorContract", {
    from: deployer,
    args: [
      governanceToken.address,
      timeLock.address,
      QUORUM_PERCENTAGE,
      VOTING_PERIOD,
      VOTING_DELAY
   ],
    log: false
  });
  log(`GovernorContract is deployed at ${governor.address}`);
  log(deployer);
}

export default deployGovernor;