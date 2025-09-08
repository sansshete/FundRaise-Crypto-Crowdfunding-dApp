"use client";

import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

// INTERNAL IMPORTS
import { CrowdFundingABI, CrowdFundingAddress } from './contants';

// FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider);

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({ children }) => {
  const titleData = 'Crowd Funding Contract';
  const [currentAccount, setCurrentAccount] = useState('');

  // Create Campaign
  const createCampaign = async (campaign) => {
    const { title, description, amount, deadline, isEquityBased, equityOffered } = campaign;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    const contract = fetchContract(signer);

    try {
      const transaction = await contract.createCampaign(
        currentAccount,
        title,
        description,
        ethers.parseUnits(amount, 18),
        new Date(deadline).getTime(),
        isEquityBased || false,
        parseInt(equityOffered || 0)
      );
      await transaction.wait();
      console.log('Contract call success', transaction);
    } catch (error) {
      console.log('Contract call failure', error);
    }
  };

  // Get All Campaigns
  const getCampaigns = async () => {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const contract = fetchContract(provider);
    const campaigns = await contract.getCampaign();

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.formatEther(campaign.target),
      deadline: Number(campaign.deadline),
      amountCollected: ethers.formatEther(campaign.amountCollected),
      isEquityBased: campaign.isEquityBased,
      totalEquityOffered: Number(campaign.totalEquityOffered),
      equityDistributed: Number(campaign.equityDistributed),
      pId: i,
    }));

    return parsedCampaigns;
  };

  // Get User's Campaigns
  const getUserCampaigns = async () => {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const contract = fetchContract(provider);
    const allCampaigns = await contract.getCampaign();
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    const currentUser = accounts[0];

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner.toLowerCase() === currentUser.toLowerCase()
    );

    const userData = filteredCampaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.formatEther(campaign.target),
      deadline: Number(campaign.deadline),
      amountCollected: ethers.formatEther(campaign.amountCollected),
      isEquityBased: campaign.isEquityBased,
      totalEquityOffered: Number(campaign.totalEquityOffered),
      equityDistributed: Number(campaign.equityDistributed),
      pId: i,
    }));

    return userData;
  };

  // Donate
  const donate = async (pId, amount) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    const contract = fetchContract(signer);

    const campaignData = await contract.donateToCampaign(pId, {
      value: ethers.parseEther(amount),
    });

    await campaignData.wait();
    window.location.reload();
    return campaignData;
  };

  // Get Donations
  const getDonations = async (pId) => {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const contract = fetchContract(provider);
    const donations = await contract.getDonators(pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];
    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.formatEther(donations[1][i]),
      });
    }

    return parsedDonations;
  };

  // Get Equity Holders
  const getEquityHolders = async (pId) => {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const contract = fetchContract(provider);
    const equityHolders = await contract.getEquityHolders(pId);
    
    return equityHolders.map(holder => ({
      holder: holder.holder,
      shares: Number(holder.shares)
    }));
  };

  // Get Campaign Equity Info
  const getCampaignEquityInfo = async (pId) => {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const contract = fetchContract(provider);
    const equityInfo = await contract.getCampaignEquityInfo(pId);
    
    return {
      isEquityBased: equityInfo.isEquityBased,
      totalEquityOffered: Number(equityInfo.totalEquityOffered),
      equityDistributed: Number(equityInfo.equityDistributed),
      remainingEquity: Number(equityInfo.remainingEquity)
    };
  };

  // Check if wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return console.log('Install MetaMask');

      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log('No accounts found');
      }
    } catch (error) {
      console.log('Error checking wallet connection:', error?.message || error);
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return console.log('Install MetaMask');

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <CrowdFundingContext.Provider
      value={{
        titleData,
        currentAccount,
        connectWallet,
        createCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        getEquityHolders,
        getCampaignEquityInfo,
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};
