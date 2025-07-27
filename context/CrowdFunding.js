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
    const { title, description, amount, deadline } = campaign;
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
        new Date(deadline).getTime()
      );
      await transaction.wait();
      console.log('Contract call success', transaction);
    } catch (error) {
      console.log('Contract call failure', error);
    }
  };

  // Get All Campaigns
  const getCampaigns = async () => {
    const provider = new ethers.JsonRpcProvider();
    const contract = fetchContract(provider);
    const campaigns = await contract.getCampaigns();

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.formatEther(campaign.target),
      deadline: Number(campaign.deadline),
      amountCollected: ethers.formatEther(campaign.amountCollected),
      pId: i,
    }));

    return parsedCampaigns;
  };

  // Get User's Campaigns
  const getUserCampaigns = async () => {
    const provider = new ethers.JsonRpcProvider();
    const contract = fetchContract(provider);
    const allCampaigns = await contract.getCampaigns();
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
    const provider = new ethers.JsonRpcProvider();
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
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};
