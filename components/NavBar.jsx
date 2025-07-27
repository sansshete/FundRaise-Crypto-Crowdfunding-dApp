"use client";

import React, { useState, useContext } from 'react';
import { CrowdFundingContext } from '../context/CrowdFunding';
import { Logo, Menu } from '../components/index';

const Navbar = () => {
  const { currentAccount, connectWallet } = useContext(CrowdFundingContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuList = ["White Paper", "Project", "Donation", "Members"];

  return (
    <div className="bg-gradient-to-r from-zinc-900 via-gray-800 to-zinc-900 text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo + Menu */}
        <div className="flex items-center space-x-8">
          <a href="/" className="flex items-center space-x-3">
            <Logo color="text-white" />
            <span className="text-2xl font-bold tracking-wider italic text-amber-400">FundRaise</span>
          </a>

          <ul className="hidden lg:flex space-x-6 text-sm font-medium">
            {menuList.map((el, i) => (
              <li key={i}>
                <a
                  href="/"
                  className="hover:text-amber-300 transition-colors duration-200"
                >
                  {el}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Wallet + Mobile Button */}
        <div className="flex items-center space-x-4">
          {currentAccount && (
            <div className="hidden lg:flex text-sm font-mono bg-zinc-700 px-4 py-1 rounded-full">
              {currentAccount.slice(0, 17)}...
            </div>
          )}

          {!currentAccount && (
            <button
              onClick={connectWallet}
              className="hidden lg:inline-block bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold px-5 py-2 rounded-full shadow hover:from-teal-600 hover:to-cyan-700 transition"
            >
              Connect Wallet
            </button>
          )}

          <button
            className="lg:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white text-gray-800 shadow-md">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center space-x-2">
                <Logo color="text-black" />
                <span className="text-xl font-bold uppercase">FundPrism</span>
              </a>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav>
              <ul className="space-y-3 text-sm">
                {menuList.map((el, i) => (
                  <li key={i}>
                    <a
                      href="/"
                      className="block py-2 px-4 hover:bg-gray-100 rounded"
                    >
                      {el}
                    </a>
                  </li>
                ))}

                <li>
                  {!currentAccount ? (
                    <button
                      onClick={connectWallet}
                      className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold py-2 rounded shadow hover:from-teal-600 hover:to-cyan-700 transition"
                    >
                      Connect Wallet
                    </button>
                  ) : (
                    <div className="text-sm text-center font-mono text-red-600 mt-2">
                      {currentAccount.slice(0, 20)}...
                    </div>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
