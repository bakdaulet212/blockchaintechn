import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    const RewardToken = await ethers.getContractFactory("RewardToken");
    const rewardToken = await RewardToken.deploy(deployer.address);
    await rewardToken.deployed();
    console.log("RewardToken deployed at:", rewardToken.address);

    const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
    const crowdfunding = await Crowdfunding.deploy(rewardToken.address);
    await crowdfunding.deployed();
    console.log("Crowdfunding deployed at:", crowdfunding.address);

    const tx = await rewardToken.transferOwnership(crowdfunding.address);
    await tx.wait();
    console.log("Ownership of RewardToken transferred to Crowdfunding contract");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });