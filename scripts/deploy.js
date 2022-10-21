const { ethers } = require("hardhat");

async function main() {
  const [deployer, executor, proposer, voter1, voter2, voter3, voter4, voter5] =
    await ethers.getSigners();
  const amount = ethers.utils.parseEther("50");

  const Token = await ethers.getContractFactory("GovernanceTokenDAO");
  const token = await Token.deploy();

  await token.connect(deployer).transfer(voter1.address, amount);
  await token.connect(deployer).transfer(voter2.address, amount);
  await token.connect(deployer).transfer(voter3.address, amount);
  await token.connect(deployer).transfer(voter4.address, amount);
  await token.connect(deployer).transfer(voter5.address, amount);

  const balanceVoter1 = await token.balanceOf(voter1.address);
  const balanceVoter4 = await token.balanceOf(voter4.address);

  console.log(ethers.utils.formatEther(balanceVoter1));
  console.log(ethers.utils.formatEther(balanceVoter4));

  const Treasury = await ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(deployer.address, { value: amount });

  await treasury.deployed();

  console.log(`Treasury deployed to ${treasury.address}`);

  const totalFunds = await treasury.totalFunds();
  const receiver = await treasury.receiver();
  const isReleased = await treasury.isReleased();

  console.log(parseInt(totalFunds));
  console.log(receiver);
  console.log(isReleased);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
