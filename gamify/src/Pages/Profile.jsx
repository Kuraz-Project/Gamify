import React, { useState, useEffect } from 'react'
import { 
  User, Mail, MapPin, Clock, Wallet, Trophy, Users, Settings, 
  Camera, Bell, Moon, Sun, Edit3, Save, X, Plus, Star,
  Calendar, Target, TrendingUp, Crown
} from 'lucide-react'

const Profile = () => {
  const [user, setUser] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    level: "Expert",
    bio: "Passionate full-stack developer with 8+ years of experience in React, Node.js, and cloud architecture. Love sharing knowledge and helping others grow in their coding journey.",
    location: "San Francisco, CA",
    timezone: "UTC-8 (PST)",
    badges: ["JavaScript", "React", "Node.js", "AWS", "TypeScript"],
    points: 12450,
    wallet: { balance: 250 },
    joinDate: "2022-03-15",
    sessionsHosted: 45,
    questionsAnswered: 312,
    rating: 4.9,
    streak: 15
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar)
  const [showAvatarOptions, setShowAvatarOptions] = useState(false)
  const [newSkill, setNewSkill] = useState("")

  const achievements = [
    { id: 1, name: "First Session", icon: "🎯", earned: true },
    { id: 2, name: "100 Answers", icon: "💯", earned: true },
    { id: 3, name: "Top Contributor", icon: "🏆", earned: true },
    { id: 4, name: "Mentor", icon: "👨‍🏫", earned: false },
  ]

  const avatarOptions = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b60340e2?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  ]

  const stats = [
    { icon: Trophy, label: "Points", value: user.points.toLocaleString(), trend: 12, color: "yellow" },
    { icon: Wallet, label: "Wallet", value: `$${user.wallet.balance}`, color: "green" },
    { icon: Users, label: "Sessions Hosted", value: user.sessionsHosted, trend: 8, color: "blue" },
    { icon: Target, label: "Questions Answered", value: user.questionsAnswered, color: "purple" },
    { icon: Calendar, label: "Current Streak", value: `${user.streak} days`, color: "orange" },
  ]

  useEffect(() => {
    if (user?.avatar) setSelectedAvatar(user.avatar)
  }, [user])

  const updateUser = (updater) => setUser(prevUser => updater(prevUser))

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
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 border hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDarkMode ? `bg-${color}-900/30` : `bg-${color}-100`}`}>
            <Icon className={`h-5 w-5 ${isDarkMode ? `text-${color}-400` : `text-${color}-600`}`} />
          </div>
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          </div>
        </div>
        {trend && (
          <div className="flex items-center text-green-500 text-sm">
            <TrendingUp className="h-4 w-4 mr-1" />
            +{trend}%
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

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <User className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Profile</h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage your personal information and preferences</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isEditing 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : `${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'} border`
            }`}
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Profile Header Card */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border overflow-hidden`}>
              <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <div className="p-8 -mt-16">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                  <div className="relative">
                    <div className={`w-32 h-32 rounded-full border-4 overflow-hidden ${isDarkMode ? 'border-gray-800 bg-gray-800' : 'border-white bg-white'}`}>
                      <img src={selectedAvatar || user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    {isEditing && (
                      <div className="absolute -bottom-2 -right-2 flex gap-2">
                        <button
                          onClick={handleAvatarUpload}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
                          title="Upload custom image"
                        >
                          <Camera className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                          className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition-colors"
                          title="Choose default avatar"
                        >
                          <User className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h2>
                      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-medium">
                          <Crown className="h-4 w-4" />
                          {user.level}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-medium">{user.rating}</span>
                        </div>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Member since {new Date(user.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && showAvatarOptions && (
                  <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Choose a default avatar:</h4>
                    <div className="flex gap-3 flex-wrap">
                      {avatarOptions.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedAvatar(url)
                            updateUser((prev) => ({ ...prev, avatar: url }))
                          }}
                          className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-colors"
                        >
                          <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
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
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border`}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Achievements</h3>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                    achievement.earned 
                      ? isDarkMode ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/20' : 'bg-gradient-to-r from-yellow-50 to-orange-50'
                      : isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <span className={`text-2xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </span>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        achievement.earned 
                          ? isDarkMode ? 'text-white' : 'text-gray-900'
                          : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </p>
                      {achievement.earned && (
                        <p className={`text-xs ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>Earned!</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Completion */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border`}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profile Completion</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overall Progress</span>
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>85%</span>
                </div>
                <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" style={{width: '85%'}}></div>
                </div>
                <div className={`text-xs space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p>✅ Basic Info Complete</p>
                  <p>✅ Avatar Added</p>
                  <p>✅ Skills Listed</p>
                  <p>⭕ Add more achievements</p>
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