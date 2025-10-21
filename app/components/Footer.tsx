import { FaPaypal, FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import React from 'react';
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-black text-white px-6 sm:px-10 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-sm font-extralight w-full">
          {/* Column 1: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-2 text-pink-400">Quick Links</h4>
            <p>Offset Printing / Forms & Receipt</p>
            <p>Corporate Giveaways</p>
            <p>Stickers & Labels</p>
            <p>Signage</p>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-lg font-semibold mb-2 invisible">Spacer</h4>
            <p>Marketing Collaterals</p>
            <p>Wall Mural</p>
            <p>Glass/Frosted Sticker</p>
            <p>Transit Ads / Vehicle Warpping</p>
          </div>
          {/* Column 3 */}
          <div>
            <h4 className="text-lg font-semibold mb-2 invisible">Spacer</h4>
            <p>Graphic Design</p>
            <p>Logo Design</p>
            <p>Light Box</p>
            <p>Other Services</p>
          </div>

          

          {/* Column 4: Follow Us */}
          <div>
            <h4 className="text-lg font-semibold  text-pink-400">Follow Us</h4>
            <div className="flex space-x-4 text-2xl">
              <a href="https://www.facebook.com/photo/?fbid=1237045431770415&set=a.469292898545676" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="bg-[#1877F2] rounded-full w-6 h-6" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Image
                  height={500}
                  width={500}
                  alt="Instagram"
                  src="/instagram.png"
                  className="h-6 w-6 object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-600 mt-8 pt-4 flex flex-col sm:flex-row justify-between items-center text-sm gap-4">
        <p>© 2025, Burnbox Printing.</p>
        <FaPaypal className="bg-blue-600 h-10 w-10 rounded-full" />
      </div>
    </footer>
  );
};

export default Footer;
