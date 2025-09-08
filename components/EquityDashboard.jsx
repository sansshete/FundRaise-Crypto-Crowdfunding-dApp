"use client";
import React, { useState, useEffect } from 'react';

const EquityDashboard = ({ campaign, getEquityHolders, getCampaignEquityInfo }) => {
  const [equityHolders, setEquityHolders] = useState([]);
  const [equityInfo, setEquityInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquityData = async () => {
      if (!campaign.isEquityBased) return;
      
      try {
        const [holders, info] = await Promise.all([
          getEquityHolders(campaign.pId),
          getCampaignEquityInfo(campaign.pId)
        ]);
        
        setEquityHolders(holders);
        setEquityInfo(info);
      } catch (error) {
        console.error('Error fetching equity data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquityData();
  }, [campaign.pId, campaign.isEquityBased]);

  if (!campaign.isEquityBased) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Equity Distribution</h3>
      
      {/* Equity Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Total Offered</p>
          <p className="text-lg font-bold text-blue-800">{equityInfo?.totalEquityOffered || 0}%</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Distributed</p>
          <p className="text-lg font-bold text-green-800">{equityInfo?.equityDistributed || 0}%</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-sm text-yellow-600 font-medium">Remaining</p>
          <p className="text-lg font-bold text-yellow-800">{equityInfo?.remainingEquity || 0}%</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">Investors</p>
          <p className="text-lg font-bold text-purple-800">{equityHolders.length}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Equity Distribution Progress</span>
          <span>{((equityInfo?.equityDistributed || 0) / (equityInfo?.totalEquityOffered || 1) * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(equityInfo?.equityDistributed || 0) / (equityInfo?.totalEquityOffered || 1) * 100}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Equity Holders List */}
      {equityHolders.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Equity Holders</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {equityHolders.map((holder, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <span className="font-mono text-sm text-gray-700">
                    {holder.holder.slice(0, 6)}...{holder.holder.slice(-4)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-blue-600">
                    {holder.shares.toFixed(4)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {equityHolders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No equity holders yet</p>
          <p className="text-sm">Be the first to invest and get equity shares!</p>
        </div>
      )}
    </div>
  );
};

export default EquityDashboard;