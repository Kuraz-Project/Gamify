import React, { useState, useEffect } from 'react'
import { useAuth } from '../App'
import {
  User, Mail, MapPin, Clock, Wallet, Trophy, Users, Settings,
  Camera, Bell, Moon, Sun, Edit3, Save, X, Plus, Star,
  Calendar, Target, TrendingUp, Crown, Award, Zap, Activity, ImageIcon
} from 'lucide-react'

const Profile = () => {
  const { user: currentUser, isAuthenticated, updateUser } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [isEditing, setIsEditing] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar)
  const [showAvatarOptions, setShowAvatarOptions] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [coverImage, setCoverImage] = useState(null)
  const [showCoverOptions, setShowCoverOptions] = useState(false)
  const [defaultCoverImages] = useState([
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=200&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
  ])

  const achievements = [
    { id: 1, name: "First Session", icon: Trophy, earned: true, description: "Hosted your first session" },
    { id: 2, name: "100 Answers", icon: Target, earned: true, description: "Answered 100 questions" },
    { id: 3, name: "Top Contributor", icon: Crown, earned: true, description: "Top 10% contributor" },
    { id: 4, name: "Mentor", icon: Users, earned: false, description: "Helped 50+ users" },
  ]

  const avatarOptions = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b60340e2?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  ]

  // Compute stats dynamically after user data is loaded
  const stats = user ? [
    { icon: Trophy, label: "Points", value: user.points?.toLocaleString() || '0', trend: 12, color: "yellow" },
    { icon: Wallet, label: "Wallet", value: `$${user.wallet?.balance || 0}`, color: "green" },
    { icon: Users, label: "Sessions Hosted", value: user.sessionsHosted || 0, trend: 8, color: "blue" },
    { icon: Target, label: "Questions Answered", value: user.questionsAnswered || 0, color: "purple" },
    { icon: Calendar, label: "Current Streak", value: `${user.streak || 0} days`, color: "orange" },
  ] : []

  // Fetch user data from database
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser || !isAuthenticated) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await fetch(`http://localhost:3000/users/${currentUser.id}`)

        if (!response.ok) {
          throw new Error('Failed to fetch user profile')
        }

        const userData = await response.json()

        // Assign default avatar and cover if not set
        if (!userData.profile?.avatar) {
          userData.profile = userData.profile || {}
          userData.profile.avatar = assignDefaultAvatar(currentUser.id)
        }

        if (!userData.profile?.coverImage) {
          userData.profile = userData.profile || {}
          userData.profile.coverImage = assignDefaultCover(currentUser.id)
        }

        // Merge with currentUser data from auth context
        const completeUserData = {
          id: currentUser.id,
          name: userData.profile?.name || currentUser.username || 'User',
          email: currentUser.email,
          avatar: userData.profile?.avatar || currentUser.avatar,
          level: userData.achievements?.level || 'Beginner',
          bio: userData.profile?.bio || 'Welcome to your profile! Edit this section to tell others about yourself.',
          location: userData.profile?.location || '',
          timezone: userData.profile?.timezone || 'UTC+3 (East Africa Time)',
          badges: userData.achievements?.badges || [],
          points: userData.achievements?.points || 0,
          wallet: { balance: 0 },
          joinDate: userData.createdAt || new Date().toISOString().split('T')[0],
          sessionsHosted: userData.stats?.sessionsHosted || 0,
          questionsAnswered: userData.stats?.questionsAnswered || 0,
          rating: userData.stats?.rating || 4.5,
          streak: userData.stats?.streak || 0
        }

        setUser(completeUserData)
        setSelectedAvatar(completeUserData.avatar)
        setCoverImage(userData.profile?.coverImage)

      } catch (error) {
        console.error('Error fetching user profile:', error)

        // Fallback to currentUser data if database fetch fails
        const fallbackUser = {
          id: currentUser.id,
          name: currentUser.username || 'User',
          email: currentUser.email,
          avatar: currentUser.avatar || assignDefaultAvatar(currentUser.id),
          level: 'Beginner',
          bio: 'Welcome to your profile! Edit this section to tell others about yourself.',
          location: '',
          timezone: 'UTC+3 (East Africa Time)',
          badges: [],
          points: 0,
          wallet: { balance: 0 },
          joinDate: new Date().toISOString().split('T')[0],
          sessionsHosted: 0,
          questionsAnswered: 0,
          rating: 4.5,
          streak: 0
        }

        setUser(fallbackUser)
        setSelectedAvatar(fallbackUser.avatar)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [currentUser, isAuthenticated])

  useEffect(() => {
    if (user?.avatar) setSelectedAvatar(user.avatar)
  }, [user])

  // Function to assign default avatar for new users
  const assignDefaultAvatar = (userId) => {
    // Simple hash function to assign consistent avatars based on user ID
    const avatarIndex = userId ? (userId.toString().split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0) % avatarOptions.length) : 0

    return avatarOptions[avatarIndex] || avatarOptions[0]
  }

  // Function to assign default cover image for new users
  const assignDefaultCover = (userId) => {
    const coverIndex = userId ? (userId.toString().split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0) % defaultCoverImages.length) : 0

    return defaultCoverImages[coverIndex] || defaultCoverImages[0]
  }

  const updateLocalUser = (updater) => setUser(prevUser => updater(prevUser))

  const handleAvatarUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          const result = ev.target?.result
          setSelectedAvatar(result)
          updateUser((prev) => ({ ...prev, avatar: result }))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleCoverUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          const result = ev.target?.result
          setCoverImage(result)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const addSkill = () => {
    if (newSkill.trim() && !user.badges.includes(newSkill.trim())) {
      updateUser(prev => ({ ...prev, badges: [...prev.badges, newSkill.trim()] }))
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove) => {
    updateUser(prev => ({ ...prev, badges: prev.badges.filter(skill => skill !== skillToRemove) }))
  }

  const StatCard = ({ icon: Icon, label, value, trend, color = "blue" }) => (
    <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50' : 'bg-gradient-to-br from-white/60 to-gray-50/60 border-gray-200/50'} rounded-2xl p-6 border backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${
            isDarkMode
              ? `from-${color}-500/20 to-${color}-600/30 group-hover:from-${color}-500/30 group-hover:to-${color}-600/40`
              : `from-${color}-50 to-${color}-100 group-hover:from-${color}-100 group-hover:to-${color}-200`
          } transition-all duration-300`}>
            <Icon className={`h-7 w-7 ${isDarkMode ? `text-${color}-400` : `text-${color}-600`}`} />
          </div>
          <div className="space-y-1">
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'} transition-colors`}>
              {label}
            </p>
            <p className={`text-3xl font-bold ${isDarkMode ? 'text-white group-hover:text-gray-100' : 'text-gray-900 group-hover:text-gray-800'} transition-colors`}>
              {value}
            </p>
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500/10 to-green-600/10 text-green-600 text-sm font-semibold rounded-full border border-green-500/20">
            <TrendingUp className="h-4 w-4" />
            <span>+{trend}%</span>
          </div>
        )}
      </div>
    </div>
  )

  const InputField = ({ icon: Icon, label, type = "text", value, onBlur, ...props }) => (
    <div className="space-y-2">
      <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type={type}
          defaultValue={value}
          disabled={!isEditing}
          className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-colors ${
            isDarkMode 
              ? 'border-gray-600 bg-gray-700 text-white disabled:bg-gray-800' 
              : 'border-gray-300 bg-white text-gray-900 disabled:bg-gray-50'
          } disabled:text-gray-500`}
          onBlur={onBlur}
          {...props}
        />
      </div>
    </div>
  )

  // Show loading state
  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} flex items-center justify-center`}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated || !currentUser) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} flex items-center justify-center p-6`}>
        <div className={`max-w-md w-full text-center space-y-6 p-8 rounded-3xl shadow-lg ${
          isDarkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'
        }`}>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <User className="text-white h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Sign In Required
            </h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Please sign in to view and manage your profile
            </p>
          </div>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <User className="h-5 w-5" />
            Sign In to Continue
          </a>
        </div>
      </div>
    )
  }

  // Show error state if user data is not available
  if (!user) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} flex items-center justify-center p-6`}>
        <div className={`max-w-md w-full text-center space-y-6 p-8 rounded-3xl shadow-lg ${
          isDarkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'
        }`}>
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto">
            <X className="text-white h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Profile Not Found
            </h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Unable to load your profile. Please try refreshing the page or contact support.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-12">
          <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-8 rounded-3xl shadow-lg backdrop-blur-sm ${
            isDarkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-gray-200/50'
          }`}>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-2xl shadow-lg">
                  <User className="text-white h-8 w-8" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="space-y-2">
                <h1 className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent ${
                  isDarkMode ? 'from-white to-gray-300' : ''
                }`}>
                  My Profile
                </h1>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Manage your personal information and preferences
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                  }`}>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Online
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Last updated: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`group flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg ${
                isEditing
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-green-500/25'
                  : `border-2 ${
                    isDarkMode
                      ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50 text-gray-300 hover:text-white'
                      : 'bg-white/50 border-gray-300 hover:bg-gray-50/50 text-gray-700 hover:text-gray-900'
                  }`
              }`}
            >
              {isEditing ? (
                <>
                  <Save className="h-5 w-5" />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <Edit3 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Profile Header Card */}
            <div className={`${isDarkMode ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white/90 border-gray-200/50'} rounded-3xl border overflow-hidden shadow-xl backdrop-blur-sm`}>
              {/* Cover Image Section */}
              <div className="relative h-56 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Camera className="h-8 w-8 text-white/70" />
                      </div>
                    </div>
                  </div>
                )}
                {isEditing && (
                  <div className="absolute top-6 right-6 flex gap-2">
                    <button
                      onClick={handleCoverUpload}
                      className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 shadow-lg hover:scale-110"
                      title="Upload cover image"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowCoverOptions(!showCoverOptions)}
                      className="bg-gray-600/60 hover:bg-gray-700/80 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200 shadow-lg hover:scale-110"
                      title="Choose default cover"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                {/* Floating Stats */}
                <div className="absolute bottom-6 left-6 flex gap-4">
                  <div className={`px-4 py-2 rounded-xl backdrop-blur-md shadow-lg ${
                    isDarkMode ? 'bg-gray-900/60' : 'bg-white/60'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user.points.toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl backdrop-blur-md shadow-lg ${
                    isDarkMode ? 'bg-gray-900/60' : 'bg-white/60'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user.sessionsHosted} sessions
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Info Section */}
              <div className="p-8 lg:p-10">
                <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="relative">
                      <div className={`w-36 h-36 rounded-full border-4 overflow-hidden shadow-2xl ${
                        isDarkMode ? 'border-gray-800 bg-gray-800' : 'border-white bg-white'
                      }`}>
                        <img src={selectedAvatar || user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>

                      {/* Online Status Indicator */}
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                    </div>

                    {isEditing && (
                      <div className="absolute -bottom-2 -right-2 flex gap-2">
                        <button
                          onClick={handleAvatarUpload}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                          title="Upload avatar"
                        >
                          <Camera className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                          title="Choose default avatar"
                        >
                          <User className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h2 className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent ${
                          isDarkMode ? 'from-white via-gray-100 to-white' : ''
                        }`}>
                          {user.name}
                        </h2>
                        <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                          {user.email}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 text-white rounded-full text-sm font-semibold shadow-lg">
                          <Crown className="h-5 w-5" />
                          {user.level}
                        </span>
                        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 text-yellow-600 rounded-full">
                          <Star className="h-5 w-5 fill-current" />
                          <span className="text-sm font-semibold">{user.rating}</span>
                          <span className={`text-sm ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                            ({user.questionsAnswered} reviews)
                          </span>
                        </div>
                        <div className={`px-3 py-2 rounded-full text-sm ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Calendar className="h-4 w-4 inline mr-2" />
                          Member since {new Date(user.joinDate).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                      </div>

                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-lg leading-relaxed max-w-2xl`}>
                        {user.bio}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Avatar Options */}
                {isEditing && showAvatarOptions && (
                  <div className={`mt-8 p-6 rounded-2xl ${
                    isDarkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Choose a default avatar:
                    </h4>
                    <div className="flex gap-4 flex-wrap">
                      {avatarOptions.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedAvatar(url)
                            updateUser((prev) => ({ ...prev, avatar: url }))
                          }}
                          className={`w-20 h-20 rounded-full overflow-hidden border-3 transition-all duration-200 hover:scale-110 ${
                            selectedAvatar === url
                              ? 'border-blue-500 shadow-lg shadow-blue-500/25'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cover Image Options */}
                {isEditing && showCoverOptions && (
                  <div className={`mt-8 p-6 rounded-2xl ${
                    isDarkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Choose a default cover image:
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {defaultCoverImages.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCoverImage(url)
                          }}
                          className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                            coverImage === url
                              ? 'border-blue-500 shadow-lg shadow-blue-500/25'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <img src={url} alt={`Cover ${idx + 1}`} className="w-full h-full object-cover" />
                          {coverImage === url && (
                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-8 border`}>
              <div className="flex items-center gap-3 mb-6">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Basic Information</h3>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    icon={User}
                    label="Full Name"
                    value={user.name}
                    onBlur={(e) => isEditing && updateUser((prev) => ({ ...prev, name: e.target.value }))}
                  />
                  <InputField
                    icon={Mail}
                    label="Email"
                    type="email"
                    value={user.email}
                    onBlur={(e) => isEditing && updateUser((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bio</label>
                  <textarea
                    defaultValue={user.bio || ''}
                    disabled={!isEditing}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg resize-none transition-colors ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 text-white disabled:bg-gray-800' 
                        : 'border-gray-300 bg-white text-gray-900 disabled:bg-gray-50'
                    } disabled:text-gray-500`}
                    onBlur={(e) => isEditing && updateUser((prev) => ({ ...prev, bio: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    icon={MapPin}
                    label="Location"
                    value={user.location || ''}
                    onBlur={(e) => isEditing && updateUser((prev) => ({ ...prev, location: e.target.value }))}
                  />
                  
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time Zone</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <select 
                        disabled={!isEditing}
                        defaultValue={user.timezone}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-colors ${
                          isDarkMode 
                            ? 'border-gray-600 bg-gray-700 text-white disabled:bg-gray-800' 
                            : 'border-gray-300 bg-white text-gray-900 disabled:bg-gray-50'
                        } disabled:text-gray-500`}
                        onChange={(e) => updateUser((prev) => ({ ...prev, timezone: e.target.value }))}
                      >
                        <option value="UTC+3 (East Africa Time)">UTC+3 (East Africa Time)</option>
                        <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                        <option value="UTC-5 (EST)">UTC-5 (EST)</option>
                        <option value="UTC-8 (PST)">UTC-8 (PST)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="space-y-3">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Skills & Expertise</label>
                  <div className="flex flex-wrap gap-2">
                    {user.badges.map((skill) => (
                      <span
                        key={skill}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(skill)}
                            className={`${isDarkMode ? 'text-blue-400 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))}
                    {isEditing && (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add skill"
                          className={`px-3 py-1 border rounded-full text-sm ${
                            isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
                          }`}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        />
                        <button
                          onClick={addSkill}
                          className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-8 border`}>
              <div className="flex items-center gap-3 mb-6">
                <Settings className="h-5 w-5 text-blue-600" />
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Preferences</h3>
              </div>
              
              <div className="space-y-6">
                <div className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    {isDarkMode ? <Moon className="h-5 w-5 text-purple-600" /> : <Sun className="h-5 w-5 text-yellow-600" />}
                    <div>
                      <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dark Mode</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Toggle between light and dark themes</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isDarkMode} 
                      onChange={(e) => setIsDarkMode(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Receive updates about sessions and activities</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notificationsEnabled} 
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="space-y-4">
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Stats</h3>
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Achievements */}
            <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50' : 'bg-gradient-to-br from-white/60 to-gray-50/60 border-gray-200/50'} rounded-3xl p-8 border backdrop-blur-sm`}>
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' : 'bg-gradient-to-br from-yellow-100 to-orange-100'}`}>
                  <Award className={`h-6 w-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Achievements</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {achievements.filter(a => a.earned).length} of {achievements.length} unlocked
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon
                  const isEarned = achievement.earned
                  return (
                    <div key={achievement.id} className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                      isEarned
                        ? isDarkMode
                          ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/40 shadow-lg shadow-yellow-500/10'
                          : 'bg-gradient-to-br from-yellow-50/80 to-orange-50/80 border-yellow-200 shadow-lg shadow-yellow-200/50'
                        : isDarkMode
                          ? 'bg-gray-700/30 border-gray-600/50'
                          : 'bg-gray-50/50 border-gray-200/50'
                    }`}>
                      {/* Achievement Card Content */}
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`relative p-3 rounded-xl transition-all duration-300 ${
                            isEarned
                              ? isDarkMode
                                ? 'bg-yellow-500/20 group-hover:bg-yellow-500/30'
                                : 'bg-yellow-100 group-hover:bg-yellow-200'
                              : isDarkMode
                                ? 'bg-gray-600/50'
                                : 'bg-gray-200/50'
                          }`}>
                            <IconComponent className={`h-6 w-6 transition-colors duration-300 ${
                              isEarned
                                ? isDarkMode
                                  ? 'text-yellow-400 group-hover:text-yellow-300'
                                  : 'text-yellow-600 group-hover:text-yellow-700'
                                : isDarkMode
                                  ? 'text-gray-500'
                                  : 'text-gray-400'
                            }`} />

                            {/* Earned Badge */}
                            {isEarned && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full border-2 border-white flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className={`font-bold text-lg transition-colors ${
                                isEarned
                                  ? isDarkMode ? 'text-white group-hover:text-yellow-200' : 'text-gray-900 group-hover:text-yellow-800'
                                  : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {achievement.name}
                              </h4>
                              {isEarned && (
                                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  <Trophy className="h-3 w-3 inline mr-1" />
                                  Earned
                                </div>
                              )}
                            </div>

                            <p className={`text-sm leading-relaxed ${
                              isEarned
                                ? isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {achievement.description}
                            </p>

                            {/* Progress Bar for Locked Achievements */}
                            {!isEarned && (
                              <div className="mt-3">
                                <div className={`w-full rounded-full h-1.5 ${
                                  isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                                }`}>
                                  <div className={`h-1.5 rounded-full transition-all duration-500 ${
                                    isDarkMode ? 'bg-gray-500' : 'bg-gray-300'
                                  }`} style={{width: '30%'}}></div>
                                </div>
                                <p className={`text-xs mt-1 ${
                                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                }`}>
                                  30% Complete
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Decorative Elements */}
                      {isEarned && (
                        <>
                          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${
                            isDarkMode ? 'from-yellow-500/10' : 'from-yellow-400/20'
                          } to-transparent rounded-bl-full`}></div>
                          <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr ${
                            isDarkMode ? 'from-orange-500/10' : 'from-orange-400/20'
                          } to-transparent rounded-tr-full`}></div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Achievement Summary */}
              <div className={`mt-8 p-6 rounded-2xl ${
                isDarkMode ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      Achievement Points
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {achievements.filter(a => a.earned).length * 100}
                  </div>
                </div>
                <div className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {achievements.length - achievements.filter(a => a.earned).length} more achievements to unlock
                </div>
              </div>
            </div>

            {/* Profile Activity Summary */}
            <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50' : 'bg-gradient-to-br from-white/60 to-gray-50/60 border-gray-200/50'} rounded-3xl p-8 border backdrop-blur-sm`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-green-500/20 to-blue-500/20' : 'bg-gradient-to-br from-green-100 to-blue-100'}`}>
                  <Activity className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profile Activity</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your engagement summary
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Progress Overview */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Profile Completion
                    </span>
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      85%
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500" style={{width: '85%'}}></div>
                  </div>
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                        <User className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Profile Views</p>
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>127</p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                        <Trophy className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                      </div>
                      <div>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>This Month</p>
                        <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>+{user.points || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-3">
                  <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Recent Activity
                  </h4>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-500'}`}></div>
                      <div className="flex-1">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Completed profile information
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          2 hours ago
                        </p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                      <div className="flex-1">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Updated avatar and cover image
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          1 day ago
                        </p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                      <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-purple-400' : 'bg-purple-500'}`}></div>
                      <div className="flex-1">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Added new skills to profile
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          3 days ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                      <Zap className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        Next: Complete more achievements
                      </p>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Help other users and unlock new badges to reach 100% completion
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
