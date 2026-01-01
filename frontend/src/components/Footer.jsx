import { FaHeart, FaFacebook, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-3xl font-bold text-red-500">BloodBridge ❤️</h2>
          <p className="mt-3 text-sm">
            Saving lives together — connecting donors with those in need, 
            because every drop counts.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-red-400">Home</a></li>
            <li><a href="/donor" className="hover:text-red-400">Become a Donor</a></li>
            <li><a href="/receiver" className="hover:text-red-400">Request Blood</a></li>
            <li><a href="/requests" className="hover:text-red-400">Active Requests</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Connect With Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-red-400"><FaFacebook /></a>
            <a href="#" className="hover:text-red-400"><FaInstagram /></a>
            <a href="#" className="hover:text-red-400"><FaLinkedin /></a>
            <a href="#" className="hover:text-red-400"><FaGithub /></a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} <span className="text-red-400 font-semibold">BloodBridge</span>. 
        Made with <FaHeart className="text-red-500 inline" /> in India 🇮🇳
      </div>
    </footer>
  );
}
