const { ethers } = require("hardhat");

async function main() {
  const [acc1] = await ethers.getSigners();
  const amount = ethers.utils.parseEther("1");

  const Treasury = await ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(acc1.address, { value: amount });

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
