import React from "react";
import { Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-16 relative">
      <div className="container relative z-10 py-12 pl-4 sm:pl-6 lg:pl-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Logo + About */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">Q</span>
              </div>
              <span className="text-2xl font-bold text-white">
                Q&A Platform
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-md text-base">
              Connect with experts, join interactive Q&A sessions, and earn rewards while learning in a vibrant global community.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-base text-gray-400">Follow us:</span>
              <div className="flex gap-3">
                <a href="#" aria-label="Twitter" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" aria-label="LinkedIn" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" aria-label="GitHub" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-base uppercase tracking-wider">Platform</h4>
            <nav className="flex flex-col space-y-3">
              <a href="/discover" className="text-gray-300 hover:text-blue-400 transition-all text-base hover:translate-x-1">Discover Sessions</a>
              <a href="/leaderboards" className="text-gray-300 hover:text-blue-400 transition-all text-base hover:translate-x-1">Leaderboards</a>
              <a href="/creator/featured" className="text-gray-300 hover:text-blue-400 transition-all text-base hover:translate-x-1">Featured Creators</a>
              <a href="/rewards" className="text-gray-300 hover:text-blue-400 transition-all text-base hover:translate-x-1">Rewards Program</a>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-base uppercase tracking-wider">Resources</h4>
            <nav className="flex flex-col space-y-3">
              <a href="/help" className="text-gray-300 hover:text-blue-400 transition-all text-base hover:translate-x-1">Help Center</a>
              <a href="/about" className="text-gray-300 hover:text-blue-400 transition-all text-base hover:translate-x-1">About Us</a>
              <a href="/blog" className="text-gray-300 hover:text-blue-400 transition-all text-base hover:translate-x-1">Blog</a>
              <a href="/contact" className="text-gray-300 hover:text-blue-400 transition-all text-base hover:translate-x-1">Contact</a>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-base uppercase tracking-wider">Legal</h4>
            <nav className="flex flex-col space-y-3">
              <a href="/terms" className="text-gray-300 hover:text-blue-400 transition-all text-base hover:translate-x-1">Terms of Service</a>
              <a href="/privacy" className="text-gray-300 hover:text-blue-400 transition-all text-base hover:translate-x-1">Privacy Policy</a>
              <a href="/cookies" className="text-gray-300 hover:text-blue-400 transition-all text-base hover:translate-x-1">Cookie Policy</a>
            </nav>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-2">Stay in the loop</h3>
              <p className="text-gray-300 text-base">Get the latest updates on new features, expert sessions, and platform news.</p>
            </div>
            <form className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-transform hover:scale-105">
                Subscribe
              </button>
            </form>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;