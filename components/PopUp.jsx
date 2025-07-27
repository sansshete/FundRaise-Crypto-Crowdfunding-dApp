"use client";
import React, { useState, useEffect } from 'react';

const PopUp = ({ setOpenModel, donate, donateFunction, getDonations }) => {
  const [amount, setAmount] = useState('');
  const [allDonationData, setAllDonationData] = useState([]);

  const createDonation = async () => {
    try {
      await donateFunction(donate.pId, amount);
      alert('Donated Successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error in createDonation function in PopUp.jsx', error);
    }
  };

  useEffect(() => {
    (async () => {
      const donationData = await getDonations(donate.pId);
      setAllDonationData(donationData);
    })();
  }, []);

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
        {/* Modal */}
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-2xl font-bold text-gray-800">
              {donate.title?.toUpperCase()}
            </h3>
            <button
              onClick={() => setOpenModel(false)}
              className="text-gray-500 hover:text-red-500 transition"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4 space-y-4">
            <p className="text-gray-600">{donate.description}</p>

            <input
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              type="number"
              step="0.01"
              placeholder="Enter amount in ETH"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              required
            />

            {/* Donation History */}
            {allDonationData?.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold text-gray-700 mb-2">Donations:</h4>
                {allDonationData.map((donation, i) => (
                  <p
                    key={i}
                    className="text-sm text-gray-500 bg-gray-100 rounded px-3 py-2"
                  >
                    {i + 1}) {donation.donation} ETH &nbsp;→&nbsp;
                    {donation.donator.slice(0, 35)}...
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 px-6 py-4 border-t">
            <button
              onClick={() => setOpenModel(false)}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
            <button
              onClick={createDonation}
              className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded hover:bg-green-700"
            >
              Donate
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-40 z-40" />
    </>
  );
};

export default PopUp;
