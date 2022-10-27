import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { MIN_DELAY } from "../helper-hardhat-config";

const deployTimeLock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments} = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("----------------------------------------------------");
  log("Deploying TimeLock...");
  const timeLock = await deploy("GovernanceTimeLock", {
    from: deployer,
    args: [
      MIN_DELAY,
      [],
      []
    ],
    log: false
  });
  log(`GovernanceTimeLock is deployed at ${timeLock.address}`);
//   log(`Proposer1: ${proposer1} and proposer2: ${proposer2}`);
//   log(`Executor1: ${executor1} and executor2: ${executor2}`);
  log(deployer);
}

export default deployTimeLock;