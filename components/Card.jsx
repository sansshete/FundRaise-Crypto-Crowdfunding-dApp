import React from 'react';

const Card = ({ allcampaign, setOpenModel, setDonate, title }) => {
  const daysLeft = (deadline) => {
    const difference = new Date(deadline).getTime() - Date.now();
    const remainingDays = difference / (1000 * 3600 * 24);
    return remainingDays > 0 ? remainingDays.toFixed(0) : '0';
  };

  return (
    <div className="px-4 py-20 mx-auto max-w-screen-xl lg:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{title}</h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {allcampaign?.map((campaign, i) => (
          <div
            key={i}
            onClick={() => {
              setDonate(campaign);
              setOpenModel(true);
            }}
            className="cursor-pointer rounded-2xl border border-gray-200 shadow-md bg-white hover:shadow-lg transition-all duration-300"
          >
            <img
              src="https://images.pexels.com/photos/932638/pexels-photo-932638.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
              alt={campaign.title}
              className="w-full h-56 object-cover rounded-t-2xl"
            />

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{campaign.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{campaign.description}</p>

              <div className="mb-3">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Created by:</span> {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Days Left:</span> {daysLeft(campaign.deadline)}
                </p>
              </div>

              <div className="flex justify-between text-sm text-gray-700 font-semibold">
                <span>Target: {campaign.target} ETH</span>
                <span>Raised: {campaign.amountCollected} ETH</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
