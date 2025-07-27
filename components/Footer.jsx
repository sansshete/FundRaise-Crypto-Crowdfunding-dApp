import React from 'react';

const Footer = () => {
  const productList = ["Market", "ERC20 Tokens", "Donation"];
  const contactList = ["support@FundPrism.com", "shivam05046@gmail.com", "Contact us"];
  const usefulLinks = ["Home", "About us", "Company Bio"];

  return (
    <footer className="bg-zinc-900 text-white pt-12 pb-6 text-sm lg:text-left">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* About */}
          <div>
            <h6 className="text-lg font-semibold text-amber-400 mb-4">FundRaise</h6>
            <p className="text-gray-300 leading-relaxed">
              Crowdfunding is a popular method of raising funds through online platforms.
              It allows many individuals to contribute small amounts to collectively fund a project.
            </p>
          </div>

          {/* Products */}
          <div>
            <h6 className="text-lg font-semibold text-teal-400 mb-4 uppercase">Products</h6>
            <ul className="space-y-3 text-gray-400">
              {productList.map((item, i) => (
                <li key={i}>
                  <a href="#!" className="hover:text-white transition">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h6 className="text-lg font-semibold text-teal-400 mb-4 uppercase">Useful Links</h6>
            <ul className="space-y-3 text-gray-400">
              {usefulLinks.map((item, i) => (
                <li key={i}>
                  <a href="#!" className="hover:text-white transition">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h6 className="text-lg font-semibold text-teal-400 mb-4 uppercase">Contact</h6>
            <ul className="space-y-3 text-gray-400">
              {contactList.map((item, i) => (
                <li key={i}>
                  <a href={`mailto:${item}`} className="hover:text-white transition">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-700 mt-12 pt-6 text-center">
          <span className="text-gray-500">
            © {new Date().getFullYear()} <span className="text-amber-400 font-semibold">FundRaise</span>. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
