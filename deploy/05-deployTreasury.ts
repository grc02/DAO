import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployTreasury: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer, receiver } = await getNamedAccounts();
  log("----------------------------------------------------")
  log("Deploying Treasury...")
  const treasury = await deploy("Treasury", {
    from: deployer,
    args: [receiver],
    log: false,
  });

  log(`Deployer's address = ${deployer}`);
  log(`Receiver's address = ${receiver}`);

  const treasuryContract = await ethers.getContractAt("Treasury", treasury.address);
  const timeLock = await ethers.getContract("GovernanceTimeLock");
  const transferTx = await treasuryContract.transferOwnership(timeLock.address);
  await transferTx.wait(1);
}

export default deployTreasury;