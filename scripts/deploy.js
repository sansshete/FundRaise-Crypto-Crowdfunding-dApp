const hre = require("hardhat");
//0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
async function main() {
  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  const crowdFunding = await CrowdFunding.deploy();

  await crowdFunding.waitForDeployment();

  console.log(`crowdFunding deployed to ${crowdFunding.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
