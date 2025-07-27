// src/app/page.js
"use client";

import React, { useEffect, useContext, useState } from "react";
import { CrowdFundingContext } from "../../context/CrowdFunding";
import { Hero, Card, Popup } from "../../components";

const Page = () => {
  const {
    titleData,
    getCampaigns,
    createCampaign,
    donate,
    getUserCampaigns,
    getDonations,
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
