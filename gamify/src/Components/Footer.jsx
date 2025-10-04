import React, { useState } from 'react'
import { Twitter, Linkedin, Github, ArrowUp } from 'lucide-react'

const Footer = ({ isDashboard = false }) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email')
      return
    }
    // Simulate API call
    setSuccess('Subscribed successfully!')
    setEmail('')
    setTimeout(() => setSuccess(''), 3000) // Clear success after 3s
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className={`${isDashboard ? 'bg-gray-50 border-t border-gray-200 mt-8' : 'bg-slate-900 text-white mt-16'} relative`}>
      <div className={`container mx-auto ${isDashboard ? 'py-8 px-4 sm:px-6 lg:px-8' : 'py-12 px-4 sm:px-6 lg:px-8'} relative z-10`}>
        {isDashboard ? (
          <>
            {/* Dashboard Footer - Professional and Clean */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
              {/* Branding */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-800 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">Q</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-gray-800">Q&A Platform</span>
                    <p className="text-sm text-gray-500">Learn. Connect. Grow.</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Quick Links</h4>
                <nav className="flex flex-col space-y-2">
                  <a href="/explore" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Browse Sessions</a>
                  <a href="/leaderboards" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Leaderboard</a>
                  <a href="/my-sessions" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">My Sessions</a>
                  <a href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Profile</a>
                </nav>
              </div>

              {/* Support */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Support</h4>
                <nav className="flex flex-col space-y-2">
                  <a href="/help" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Help Center</a>
                  <a href="/feedback" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Feedback</a>
                  <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Contact Us</a>
                </nav>
              </div>

              {/* Copyright & Social */}
              <div className="flex flex-col items-start md:items-end gap-4">
                <div className="text-right">
                  <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Q&A Platform</p>
                  <p className="text-gray-400 text-xs">Version 1.2.3</p>
                </div>
                <div className="flex gap-3">
                  <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors" aria-label="Twitter">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors" aria-label="GitHub">
                    <Github className="w-5 h-5" />
                  </a>
                </div>
                <button
                  onClick={scrollToTop}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors mt-2"
                  aria-label="Scroll to top"
                >
                  <ArrowUp /> Back to Top
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Non-Dashboard Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
              {/* Logo + About */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">Q</span>
                  </div>
                  <span className="text-2xl font-bold text-white">Q&A Platform</span>
                </div>
                <p className="text-gray-300 leading-relaxed max-w-md text-base">
                  Connect with experts, join interactive Q&A sessions, and earn rewards while learning in a vibrant global community.
                </p>
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

              {/* Platform Links */}
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
                <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`flex-1 md:w-64 px-4 py-3 bg-white/10 border ${error ? 'border-red-300' : 'border-white/20'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-transform hover:scale-105"
                    aria-label="Subscribe to newsletter"
                  >
                    Subscribe
                  </button>
                </form>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                {success && <p className="text-green-400 text-sm mt-2">{success}</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </footer>
  )
}

export default Footer