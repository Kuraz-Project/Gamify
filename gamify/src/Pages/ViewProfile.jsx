import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { 
  User, MapPin, Clock, Wallet, Trophy, Users, Target, TrendingUp, Crown, Award, Star, Calendar, Heart, Share2, Plus, CheckCircle, AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import db from '../db.json' // Import the db.json file

const ViewProfile = () => {
  const { id } = useParams() // Matches route path="viewProfile/:id"
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)

  const achievements = [
    { id: 1, name: "First Session", icon: Trophy, earned: true, description: "Hosted your first session", rarity: 'Common' },
    { id: 2, name: "100 Answers", icon: Target, earned: true, description: "Answered 100 questions", rarity: 'Rare' },
    { id: 3, name: "Top Contributor", icon: Crown, earned: true, description: "Top 10% contributor", rarity: 'Epic' },
    { id: 4, name: "Mentor", icon: Users, earned: false, description: "Helped 50+ users", rarity: 'Legendary' },
  ]

  const stats = user ? [
    { icon: Trophy, label: "Points", value: user.achievements?.points?.toLocaleString() || '0', trend: 12, color: "text-yellow-600" },
    { icon: Wallet, label: "Wallet", value: `$0`, color: "text-green-600" }, // Wallet not in db.json, using placeholder
    { icon: Users, label: "Sessions Hosted", value: user.content?.schedule?.length || 0, trend: 8, color: "text-blue-600" },
    { icon: Target, label: "Questions Answered", value: user.performance?.totalRatings || 0, color: "text-purple-600" },
    { icon: Calendar, label: "Current Streak", value: `0 days`, color: "text-orange-600" }, // Streak not in db.json, using placeholder
  ] : []

  const recentSessions = user ? user.content?.schedule?.map((session, index) => ({
    id: index + 1,
    title: session.topic,
    date: new Date(session.date).toLocaleDateString('en-US'),
    participants: session.currentAttendees,
    rating: user.performance?.averageRating || 4.5,
    category: 'General', // Category not in db.json, using placeholder
    price: 25, // Price not in db.json, using placeholder
    live: session.status === 'scheduled'
  })) : []

  useEffect(() => {
    const loadProfile = () => {
      try {
        console.log('Loading profile for id:', id) // Debug log
        if (!id) throw new Error('No user ID provided')

        // Find user from db.json
        const parsedId = parseInt(id, 10)
        const foundUser = db.users.find(u => u.id === parsedId)
        if (!foundUser) throw new Error('User not found in db.json')

        console.log('Loaded user data:', foundUser) // Debug log
        setUser(foundUser)
      } catch (error) {
        console.error('Error loading profile:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [id])

  const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <Card className="hover:shadow-md transition-shadow bg-white border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
          {trend && (
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{trend}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const AchievementCard = ({ achievement }) => {
    const { name, icon: Icon, earned, description, rarity } = achievement
    const rarityColors = {
      Common: 'bg-gray-100 text-gray-800',
      Rare: 'bg-blue-100 text-blue-800',
      Epic: 'bg-purple-100 text-purple-800',
      Legendary: 'bg-yellow-100 text-yellow-800',
    }

    return (
      <Card className={`${earned ? 'opacity-100' : 'opacity-60'} hover:shadow-md transition-shadow bg-white border-gray-200`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${rarityColors[rarity].split(' ')[0]}`}>
              <Icon className={`h-5 w-5 ${rarityColors[rarity].split(' ')[1]}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-900">{name}</h4>
                <Badge className={rarityColors[rarity]}>{rarity}</Badge>
              </div>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            {earned && <CheckCircle className="h-5 w-5 text-green-600" />}
          </div>
          {!earned && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">30% Complete</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-white border-gray-200">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Error</h2>
            <p className="text-gray-600">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-white border-gray-200">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Profile Not Found</h2>
            <p className="text-gray-600">Unable to load this profile. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        <Card className="relative overflow-hidden bg-white border-gray-200">
          <div className="relative h-48 sm:h-64 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600">
            {user.profile?.coverImage ? (
              <img src={user.profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 opacity-80"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>

          <CardContent className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative -mt-20 sm:-mt-24">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={user.profile.avatar} alt={user.username} />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{user.username}</h1>
                    <p className="text-lg text-gray-600">{user.profile.bio}</p>
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => setIsFollowing(!isFollowing)} 
                      variant={isFollowing ? 'secondary' : 'default'}
                      className="flex items-center gap-2"
                    >
                      {isFollowing ? <Heart className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    {user.performance.averageRating} ({user.performance.totalRatings} reviews)
                  </Badge>
                  <Badge variant="outline" className="text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    Member since {new Date(user.profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-8">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{user.profile.bio}</p>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{user.profile.location || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{user.profile.timezone || 'Not specified'}</span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.achievements.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">{badge}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentSessions.map((session) => (
                  <Card key={session.id} className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{session.title}</h4>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
                            <span>{session.date}</span>
                            <span>{session.participants} participants</span>
                            <Badge variant="outline">{session.category}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{session.rating}</span>
                          </div>
                          <Button 
                            variant={session.live ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => alert(`${session.live ? 'Joining' : 'Booking'} session: ${session.title}`)}
                          >
                            {session.live ? 'Join Live' : 'Book'} (${session.price})
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {recentSessions.length === 0 && (
                  <p className="text-gray-600 text-center">No recent sessions to display.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{achievements.filter(a => a.earned).length} of {achievements.length} unlocked</p>
                {achievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewProfile