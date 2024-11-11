import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys the "VotingSystem" contract using the deployer account
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployVotingSystem: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy the VotingSystem contract
  const deployment = await deploy("VotingSystem", {
    from: deployer,
    log: true,
    autoMine: true, // Automatically mine the transaction on local networks
  });

  // Get the deployed contract instance
  const votingSystemContract = await hre.ethers.getContractAt("VotingSystem", deployment.address);

  console.log("🎉 VotingSystem deployed at:", await votingSystemContract.getAddress());
};

export default deployVotingSystem;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g., yarn deploy --tags VotingSystem
deployVotingSystem.tags = ["VotingSystem"];
