// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RewardToken.sol";

contract Crowdfunding {
    struct Campaign {
        string title;
        uint256 goal;
        uint256 deadline;
        uint256 totalFunded;
        address creator;
        bool finalized;
    }

    Campaign[] public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    RewardToken public rewardToken;

    constructor() {
        
        rewardToken = new RewardToken(address(this));
    }

    function createCampaign(
        string memory _title,
        uint256 _goal,
        uint256 _duration
    ) external {
        campaigns.push(
            Campaign({
                title: _title,
                goal: _goal,
                deadline: block.timestamp + _duration,
                totalFunded: 0,
                creator: msg.sender,
                finalized: false
            })
        );
    }

    function contribute(uint256 _campaignId) external payable {
        Campaign storage campaign = campaigns[_campaignId];

        require(block.timestamp < campaign.deadline, "Campaign ended");
        require(msg.value > 0, "Send ETH");

        campaign.totalFunded += msg.value;
        contributions[_campaignId][msg.sender] += msg.value;

        
        uint256 rewardAmount = (msg.value * 100) / 1 ether;
        rewardToken.mint(msg.sender, rewardAmount);
    }

    function finalizeCampaign(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];

        require(block.timestamp >= campaign.deadline, "Not ended yet");
        require(!campaign.finalized, "Already finalized");

        campaign.finalized = true;
    }

    function getCampaignsCount() external view returns (uint256) {
        return campaigns.length;
    }
}
