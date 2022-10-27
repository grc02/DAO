const { ethers } = require("hardhat");

async function main() {
  // Initial setup of the variables
  const [deployer, executor, proposer, voter1, voter2, voter3, voter4, voter5] =
    await ethers.getSigners();
  const amount = ethers.utils.parseEther("50");

  // Token contract deployment

  const Token = await ethers.getContractFactory("GovernanceTokenDAO");
  const token = await Token.deploy();

  await token.connect(deployer).transfer(voter1.address, amount);
  await token.connect(deployer).transfer(voter2.address, amount);
  await token.connect(deployer).transfer(voter3.address, amount);
  await token.connect(deployer).transfer(voter4.address, amount);
  await token.connect(deployer).transfer(voter5.address, amount);

  // Timelock deployment

  const minDelay = 0;

  const GovernanceTimeLock = await ethers.getContractFactory(
    "GovernanceTimeLock"
  );
  const timeLock = await GovernanceTimeLock.deploy(
    minDelay,
    [proposer.address],
    [executor.address]
  );

  await timeLock.deployed();

  const _minDelay = await timeLock.getMinDelay();

  // GovernorContract deployment

  const GovernorContract = await ethers.getContractFactory("GovernorContract");
  const governor = await GovernorContract.deploy(
    token.address,
    timeLock.address
  );

  await governor.deployed();

  // Treasury contract deployment

  const Treasury = await ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(executor.address, { value: amount });

  await treasury.deployed();

  await treasury.transferOwnership(timeLock.address);

  // Assign the roles

  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();

  await timeLock.grantRole(proposerRole, governor.address);
  await timeLock.grantRole(executorRole, governor.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
