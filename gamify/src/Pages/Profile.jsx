import React, { useState } from 'react'
import { useAuth } from '../App'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input, Textarea } from './ui/input'
import { Label, Separator, Switch } from './ui/other'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaClock, FaWallet, FaTrophy, FaUsers, FaCog, FaCamera, FaBell, FaMoon, FaSun } from 'react-icons/fa'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'))
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8"><div className="text-center"><h1>Please log in to view your profile</h1></div></div>
    )
  }

  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar)
  const avatarOptions = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b60340e2?w=100&h=100&fit=crop&crop=face',
  ]
  const [showAvatarOptions, setShowAvatarOptions] = useState(false)

  const handleAvatarUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          const next = ev.target?.result
          setSelectedAvatar(next)
          updateUser((prev) => ({...prev, avatar: next}))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleDarkModeToggle = (enabled) => {
    setIsDarkMode(enabled)
    if (enabled) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600/10 rounded-full flex items-center justify-center"><FaUser className="text-blue-600" /></div>
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and preferences</p>
          </div>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'default' : 'outline'}>
          <FaCog className="mr-2" /> {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-2 ring-gray-200">
                    <AvatarImage src={selectedAvatar || user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl bg-blue-600 text-white">{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2 flex gap-1">
                      <Button size="sm" className="rounded-full h-8 w-8 p-0" onClick={handleAvatarUpload} title="Upload custom image"><FaCamera /></Button>
                      <Button size="sm" variant="outline" className="rounded-full h-8 w-8 p-0" onClick={() => setShowAvatarOptions(!showAvatarOptions)} title="Choose default avatar"><FaUser /></Button>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <Badge variant="secondary">{user.level}</Badge>
                </div>
              </div>

              {isEditing && showAvatarOptions && (
                <div className="space-y-2">
                  <Label>Choose a default avatar:</Label>
                  <div className="flex gap-2 flex-wrap">
                    {avatarOptions.map((url, idx) => (
                      <Button key={idx} variant="outline" className="p-1 h-auto" onClick={() => { setSelectedAvatar(url); updateUser((prev) => ({...prev, avatar: url})) }}>
                        <Avatar className="h-12 w-12"><AvatarImage src={url} /><AvatarFallback>A{idx+1}</AvatarFallback></Avatar>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="flex items-center gap-2">
                    <FaUser className="text-gray-500" />
                    <Input id="name" defaultValue={user.name} disabled={!isEditing} onBlur={(e) => isEditing && updateUser((prev) => ({...prev, name: e.target.value}))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-500" />
                    <Input id="email" type="email" defaultValue={user.email} disabled={!isEditing} onBlur={(e) => isEditing && updateUser((prev) => ({...prev, email: e.target.value}))} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio / Personal Description</Label>
                <Textarea id="bio" defaultValue={user.bio || ''} disabled={!isEditing} className="min-h-[100px]" onBlur={(e) => isEditing && updateUser((prev) => ({...prev, bio: e.target.value}))} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-500" />
                    <Input id="location" defaultValue={user.location || ''} disabled={!isEditing} onBlur={(e) => isEditing && updateUser((prev) => ({...prev, location: e.target.value}))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-500" />
                    <Select>
                      <SelectTrigger><SelectValue placeholder={user.timezone || 'UTC+3 (East Africa Time)'} /></SelectTrigger>
                      <SelectContent>
                        {['UTC+3 (East Africa Time)','UTC+0 (GMT)','UTC-5 (EST)','UTC-8 (PST)'].map((tz) => (
                          <SelectItem key={tz} value={tz} onClick={() => updateUser((prev) => ({...prev, timezone: tz}))}>{tz}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Expertise / Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {(user.badges || []).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your platform experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDarkMode ? <FaMoon /> : <FaSun />}
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-gray-600">Toggle between light and dark themes</p>
                  </div>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={handleDarkModeToggle} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaBell />
                  <div>
                    <Label>Notifications</Label>
                    <p className="text-sm text-gray-600">Receive updates about sessions and activities</p>
                  </div>
                </div>
                <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Quick Stats</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><FaTrophy className="text-yellow-500" /><span className="text-sm">Points</span></div><span className="font-medium">{user.points?.toLocaleString()}</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><FaWallet className="text-green-500" /><span className="text-sm">Wallet</span></div><span className="font-medium">${user.wallet?.balance}</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><FaUsers className="text-blue-500" /><span className="text-sm">Followers</span></div><span className="font-medium">1,247</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile


