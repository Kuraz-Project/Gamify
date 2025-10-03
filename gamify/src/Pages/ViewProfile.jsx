import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  User, Mail, Calendar, Trophy, Crown, Award, Users, Star, Moon, Sun
} from 'lucide-react'

const ViewProfile = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const response = await fetch(`http://localhost:3000/users/${id}`)
        if (!response.ok) throw new Error('User not found')
        const data = await response.json()
        setUser(data)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [id])

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto">
            <User className="text-white h-8 w-8" />
          </div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profile Not Found</h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>This user does not exist.</p>
        </div>
      </div>
    )
  }

  const { username, email, profile, achievements, social, performance } = user

  return (
    <div className={`min-h-screen w-full h-full flex flex-col ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      {/* Theme Toggle */}
      <div className="flex justify-end mb-2 px-6 pt-6">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-purple-600'}`}
          title="Toggle dark mode"
        >
          {isDarkMode ? <Moon /> : <Sun />}
        </button>
      </div>

      {/* Card - now full width and height */}
      <div className={`flex-1 w-full h-full rounded-none shadow-none border-none backdrop-blur-sm ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'}`}>
        {/* Cover */}
        <div className="relative h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 w-full">
          <img
            src={profile?.avatar || profile?.fallbackAvatar || 'https://ui-avatars.com/api/?name=' + username}
            alt={username}
            className="absolute left-8 -bottom-16 w-32 h-32 rounded-full border-4 object-cover shadow-lg bg-white"
            style={{ borderColor: isDarkMode ? '#222' : '#fff' }}
          />
        </div>
        <div className="pt-20 pb-8 px-8 w-full">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{username}</h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 flex items-center gap-2`}>
            <Mail className="inline h-5 w-5 mr-1" /> {email}
          </p>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 text-white rounded-full text-sm font-semibold shadow-lg">
              <Crown className="h-5 w-5" />
              {achievements?.level || 'Beginner'}
            </span>
            <span className={`flex items-center gap-2 px-3 py-2 bg-yellow-500/10 text-yellow-600 rounded-full`}>
              <Star className="h-5 w-5 fill-current" />
              <span className="text-sm font-semibold">{profile?.isVerified ? 'Verified' : 'Unverified'}</span>
            </span>
            <span className={`px-3 py-2 rounded-full text-sm ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              <Calendar className="h-4 w-4 inline mr-2" />
              Joined {profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
            </span>
            <span className={`px-3 py-2 rounded-full text-sm ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              Status: <span className="font-semibold">{profile?.status || 'active'}</span>
            </span>
          </div>
          {profile?.bio && (
            <p className={`text-lg leading-relaxed max-w-2xl mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {profile.bio}
            </p>
          )}
          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 mt-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Ratings: {performance?.totalRatings || 0}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-green-500" />
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Following: {social?.totalFollowing || 0}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-blue-500" />
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Badges: {achievements?.badges?.length || 0}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Level: {achievements?.level || 'Beginner'}</span>
              </div>
            </div>
          </div>
          {/* Badges */}
          {achievements?.badges?.length > 0 && (
            <div className="mb-8">
              <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Badges</h3>
              <div className="flex flex-wrap gap-2">
                {achievements.badges.map((badge, idx) => (
                  <span key={idx} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                    <Award className="h-4 w-4" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewProfile