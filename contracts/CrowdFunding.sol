// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        address[] donators;
        uint256[] donations;
        bool isEquityBased;
        uint256 totalEquityOffered;
        uint256 equityDistributed;
        mapping(address => uint256) equityShares;
    }

    struct EquityHolder {
        address holder;
        uint256 shares;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => EquityHolder[]) public campaignEquityHolders;
    uint256 public numberOfCampaigns = 0;

    event CampaignCreated(uint256 indexed campaignId, address indexed owner, bool isEquityBased);
    event DonationMade(uint256 indexed campaignId, address indexed donor, uint256 amount);
    event EquityDistributed(uint256 indexed campaignId, address indexed investor, uint256 shares);

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        bool _isEquityBased,
        uint256 _totalEquityOffered
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(_deadline > block.timestamp, "The deadline should be a date in the future");
        
        if (_isEquityBased) {
            require(_totalEquityOffered > 0 && _totalEquityOffered <= 100, "Equity offered must be between 1-100%");
        }

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.isEquityBased = _isEquityBased;
        campaign.totalEquityOffered = _totalEquityOffered;
        campaign.equityDistributed = 0;

        emit CampaignCreated(numberOfCampaigns, _owner, _isEquityBased);
        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        // Calculate equity if this is an equity-based campaign
        if (campaign.isEquityBased && campaign.target > 0) {
            uint256 equityShare = (amount * campaign.totalEquityOffered) / campaign.target;
            
            if (campaign.equityDistributed + equityShare <= campaign.totalEquityOffered) {
                campaign.equityShares[msg.sender] += equityShare;
                campaign.equityDistributed += equityShare;
                
                // Update or add to equity holders array
                bool holderExists = false;
                for (uint256 i = 0; i < campaignEquityHolders[_id].length; i++) {
                    if (campaignEquityHolders[_id][i].holder == msg.sender) {
                        campaignEquityHolders[_id][i].shares += equityShare;
                        holderExists = true;
                        break;
                    }
                }
                
                if (!holderExists) {
                    campaignEquityHolders[_id].push(EquityHolder(msg.sender, equityShare));
                }
                
                emit EquityDistributed(_id, msg.sender, equityShare);
            }
        }

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");
        if (sent) {
            campaign.amountCollected += amount;
        }

        emit DonationMade(_id, msg.sender, amount);
    }

    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }
    
    function getCampaign() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }

    function getEquityHolders(uint256 _id) public view returns (EquityHolder[] memory) {
        return campaignEquityHolders[_id];
    }

    function getInvestorEquity(uint256 _id, address _investor) public view returns (uint256) {
        return campaigns[_id].equityShares[_investor];
    }

    function getCampaignEquityInfo(uint256 _id) public view returns (
        bool isEquityBased,
        uint256 totalEquityOffered,
        uint256 equityDistributed,
        uint256 remainingEquity
    ) {
        Campaign storage campaign = campaigns[_id];
        return (
            campaign.isEquityBased,
            campaign.totalEquityOffered,
            campaign.equityDistributed,
            campaign.totalEquityOffered - campaign.equityDistributed
        );
    }
}