import pkg from "hardhat";
const { ethers } = pkg;
import { expect } from "chai";

describe("Crowdfunding", function () {
    let crowdfunding;
    let owner;
    let user;

    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();

        const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
        crowdfunding = await Crowdfunding.deploy();
        await crowdfunding.waitForDeployment();
    });

    it("should create a campaign", async function () {
        await crowdfunding.createCampaign(
            "Test Campaign",
            ethers.parseEther("1"),
            3600
        );

        const campaign = await crowdfunding.campaigns(0);

        expect(campaign.title).to.equal("Test Campaign");
        expect(campaign.goal).to.equal(ethers.parseEther("1"));
        expect(campaign.creator).to.equal(owner.address);
    });

    it("should accept contributions", async function () {
        await crowdfunding.createCampaign(
            "Test Campaign",
            ethers.parseEther("1"),
            3600
        );

        await crowdfunding.connect(user).contribute(0, {
            value: ethers.parseEther("0.5"),
        });

        const campaign = await crowdfunding.campaigns(0);
        expect(campaign.totalFunded).to.equal(
            ethers.parseEther("0.5")
        );
    });
});
