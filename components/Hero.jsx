"use client";
import React, { useState } from 'react';

const Hero = ({ titleData, createCampaign }) => {
  const [campaign, setCampaign] = useState({
    title: '',
    description: '',
    amount: '',
    deadline: '',
  });

  const createNewCampaign = async (e) => {
    e.preventDefault();
    try {
      const data = await createCampaign(campaign);
      alert('Campaign Successfully Created');
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="relative">
      <img
        src="https://images.pexels.com/photos/3228766/pexels-photo-3228766.jpeg"
        alt="Hero"
        className="absolute inset-0 object-cover w-full h-full"
      />
      <div className="relative bg-black bg-opacity-60">
        <div className="px-4 py-20 mx-auto max-w-screen-xl md:px-24 lg:px-8">
          <div className="flex flex-col items-center justify-between lg:flex-row">
            {/* Left Text Section */}
            <div className="w-full max-w-xl mb-12 text-white lg:mb-0 lg:pr-16 lg:w-7/12">
              <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                FundRaise with Blockchain <br />
                <span className="text-green-400">The Ultimate CrowdFund</span>
              </h2>
              <p className="mb-6 text-lg text-gray-200">
                Crowdfunding is a popular way to raise funds for creative,
                charitable, and entrepreneurial projects. Our platform
                leverages the transparency of blockchain to ensure trust,
                security, and global reach.
              </p>
              <a
                href="#"
                className="inline-flex items-center font-semibold text-green-400 hover:underline"
              >
                Learn more
                <svg
                  className="w-4 h-4 ml-2"
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <path d="M9.707 5.293l-5-5A1 1 0 003.293 1.707L7.586 6 3.293 10.293a1 1 0 001.414 1.414l5-5a1 1 0 000-1.414z" />
                </svg>
              </a>
            </div>

            {/* Form Section */}
            <div className="w-full max-w-xl lg:w-5/12">
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <h3 className="mb-6 text-2xl font-semibold text-center text-gray-800">
                  Create a Campaign
                </h3>
                <form onSubmit={createNewCampaign} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Campaign title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      onChange={(e) =>
                        setCampaign({ ...campaign, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      required
                      placeholder="Describe your campaign"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      onChange={(e) =>
                        setCampaign({ ...campaign, description: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Target Amount (ETH)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g., 1.5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      onChange={(e) =>
                        setCampaign({ ...campaign, amount: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Deadline
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      onChange={(e) =>
                        setCampaign({ ...campaign, deadline: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-3 text-lg font-bold text-white bg-green-500 rounded-md hover:bg-green-600 transition"
                  >
                    Create Campaign
                  </button>
                </form>
                <p className="mt-3 text-sm text-gray-500 text-center">
                  Start raising funds in minutes with the power of Ethereum.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
