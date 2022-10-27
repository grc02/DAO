import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("----------------------------------------------------");
  log("Deploying GovernanceToken and waiting for confirmations...");
  const governanceToken = await deploy("GovernanceTokenDAO", {
    from: deployer,
    args: [],
    log: false
  });
  log(`GovernanceTokenDAO is deployed at ${governanceToken.address}`);
  log(`Delegating to ${deployer}`);
  await delegate(governanceToken.address, deployer);
  log("Delegated!");
}

const delegate = async (governanceTokenDAOAddress: string, delegatedAccount: string) => {
  const governanceTokenDAO = await ethers.getContractAt("GovernanceTokenDAO", governanceTokenDAOAddress);
  const transactionResponse = await governanceTokenDAO.delegate(delegatedAccount);
  await transactionResponse.wait(1);
  console.log(`Checkpoints: ${await governanceTokenDAO.numCheckpoints(delegatedAccount)}`);
}

export default deployGovernanceToken;