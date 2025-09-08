// src/app/page.js
"use client";

import React, { useEffect, useContext, useState } from "react";
import { CrowdFundingContext } from "../../context/CrowdFunding";
import { Hero, Card, Popup, EquityDashboard } from "../../components";

const Page = () => {
  const {
    titleData,
    getCampaigns,
    createCampaign,
    donate,
    getUserCampaigns,
    getDonations,
    getEquityHolders,
    getCampaignEquityInfo,
  } = useContext(CrowdFundingContext);

  const [allCampaigns, setAllCampaigns] = useState([]);
  const [userCampaigns, setUserCampaigns] = useState([]);

  const [openModel, setOpenModel] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState(null);

  // Fetch campaigns on component mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const all = await getCampaigns();
        const user = await getUserCampaigns();
        setAllCampaigns(all || []);
        setUserCampaigns(user || []);
      } catch (err) {
        console.error("Failed to fetch campaign data:", err);
      }
    };

    fetchCampaigns();
  }, [getCampaigns, getUserCampaigns]);

  return (
    <>
      <Hero titleData={titleData} createCampaign={createCampaign} />

      <Card
        title="All Listed Campaigns"
        allcampaign={allCampaigns}
        setOpenModel={setOpenModel}
        setDonate={setDonateCampaign}
      />

      {/* Show equity dashboard for equity-based campaigns */}
      {allCampaigns.some(campaign => campaign.isEquityBased) && (
        <div className="px-4 py-12 mx-auto max-w-screen-xl lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Equity-Based Campaigns</h2>
          <div className="grid gap-8 lg:grid-cols-2">
            {allCampaigns
              .filter(campaign => campaign.isEquityBased)
              .map((campaign, index) => (
                <EquityDashboard
                  key={index}
                  campaign={campaign}
                  getEquityHolders={getEquityHolders}
                  getCampaignEquityInfo={getCampaignEquityInfo}
                />
              ))}
          </div>
        </div>
      )}

      {/* Optional: Display only if user created campaigns exist
      <Card
        title="Your Created Campaigns"
        allcampaign={userCampaigns}
        setOpenModel={setOpenModel}
        setDonate={setDonateCampaign}
      />
      */}

      {openModel && (
        <Popup
          setOpenModel={setOpenModel}
          getDonations={getDonations}
          donate={donateCampaign}
          donateFunction={donate}
        />
      )}
    </>
  );
};

export default Page;
