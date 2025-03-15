import { FaTwitter, FaGithub, FaDiscord, FaLinkedin, FaYoutube } from "react-icons/fa";
import logo from "@/assets/icons/logo.svg"

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 py-16 px-8 border-t">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* Brand & Tagline */}
        <div className="flex flex-col items-center md:items-start">
        <a href="#" className="text-xl font-bold text-black">
            <img src={logo} alt="AutomateRFP logo" width="80" height="40" />{" "}
          </a>
          <p className="text-gray-600 mt-2 text-center md:text-left">
            Automate repetitive tasks & create RFPs in minutes.
          </p>
          <div className="flex mt-4 space-x-4 text-gray-600">
            <a href="#" className="hover:text-blue-500 transition-colors">
              <FaTwitter className="text-xl" />
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              <FaGithub className="text-xl" />
            </a>
            <a href="#" className="hover:text-purple-500 transition-colors">
              <FaDiscord className="text-xl" />
            </a>
            <a href="#" className="hover:text-blue-700 transition-colors">
              <FaLinkedin className="text-xl" />
            </a>
            <a href="#" className="hover:text-red-500 transition-colors">
              <FaYoutube className="text-xl" />
            </a>
          </div>
        </div>

        {/* Useful Links */}
        <div className="flex flex-col text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors mb-2">About Us</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors mb-2">Careers</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors mb-2">Press</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors mb-2">Security</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Partners</a>
        </div>

        {/* Resources */}
        <div className="flex flex-col text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4">Resources</h3>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors mb-2">Case Studies</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors mb-2">API Docs</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors mb-2">Help Center</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors mb-2">Contact</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</a>
        </div>

        {/* Legal */}
        <div className="flex flex-col text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4">Legal</h3>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors mb-2">Privacy Policy</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors mb-2">Terms of Service</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors mb-2">Cookie Policy</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">GDPR Compliance</a>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
          <p className="text-gray-600 mb-4">
            Subscribe to our newsletter for the latest updates and insights.
          </p>
          <form className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright & Additional Links */}
      <div className="text-center text-gray-500 text-sm mt-12 border-t pt-8">
        <p>&copy; 2025 AutomateRFP. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
          <span>|</span>
          <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
          <span>|</span>
          <a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}