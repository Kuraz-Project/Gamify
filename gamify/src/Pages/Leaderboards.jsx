import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label, Progress } from './ui/other'
import { FaTrophy, FaMedal, FaCrown, FaChartLine, FaStar, FaAward, FaUsers, FaCommentDots, FaCalendarAlt, FaBullseye } from 'react-icons/fa'
import { useAuth } from '../App'

const topLearners = [
  { id: 1, rank: 1, name: 'Emma Thompson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=100&h=100&fit=crop&crop=face', points: 15420, level: 'Master', badges: ['Top Learner', 'Question Master', 'Knowledge Seeker'], sessionsAttended: 89, questionsAsked: 234, change: '+12%' },
  { id: 2, rank: 2, name: 'David Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', points: 14890, level: 'Expert', badges: ['Early Adopter', 'Consistent Learner', 'Community Helper'], sessionsAttended: 76, questionsAsked: 198, change: '+8%' },
  { id: 3, rank: 3, name: 'Sofia Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', points: 13650, level: 'Expert', badges: ['Tech Enthusiast', 'Session Regular', 'Mentor'], sessionsAttended: 65, questionsAsked: 167, change: '+15%' },
]

const topCreators = [
  { id: 1, rank: 1, name: 'Dr. Sarah Chen', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face', rating: 4.9, totalSessions: 45, totalStudents: 2340, specialty: 'AI & Healthcare', earnings: '$12,450', badges: ['Top Rated', 'Expert', 'Research Leader'], change: '+18%' },
  { id: 2, rank: 2, name: 'Michael Torres', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', rating: 4.8, totalSessions: 32, totalStudents: 1890, specialty: 'Startup Strategy', earnings: '$9,870', badges: ['Entrepreneur', 'Mentor', 'Growth Expert'], change: '+12%' },
]

const achievements = [
  { name: 'First Session', description: 'Attend your first Q&A session', icon: FaBullseye, rarity: 'Common', earned: 1890 },
  { name: 'Question Master', description: 'Ask 100 meaningful questions', icon: FaCommentDots, rarity: 'Rare', earned: 234 },
  { name: 'Top Contributor', description: 'Be in top 10% this month', icon: FaCrown, rarity: 'Epic', earned: 89 },
  { name: 'Knowledge Seeker', description: 'Complete 50 sessions', icon: FaTrophy, rarity: 'Legendary', earned: 45 },
]

const rankIcon = (rank) => rank === 1 ? <FaCrown className="text-yellow-500" /> : rank === 2 ? <FaMedal className="text-gray-400" /> : rank === 3 ? <FaTrophy className="text-amber-600" /> : <span className="text-lg font-bold text-gray-500">#{rank}</span>

const rarityColor = (rarity) => rarity === 'Legendary' ? 'text-yellow-600' : rarity === 'Epic' ? 'text-purple-600' : rarity === 'Rare' ? 'text-blue-600' : 'text-gray-600'

const Leaderboards = () => {
  const { user } = useAuth()
  const [timePeriod, setTimePeriod] = useState('weekly')

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Leaderboards</h1>
        <p className="text-gray-600">See how you rank among the community and discover top performers</p>
      </div>

      {user && (
        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-blue-200"><AvatarImage src={user.avatar} /><AvatarFallback>{user.name.charAt(0)}</AvatarFallback></Avatar>
                <div>
                  <h3 className="font-semibold text-lg">Your Current Rank</h3>
                  <p className="text-gray-600">#{23} • {user.points} points • {user.level}</p>
                  <div className="flex items-center gap-2 mt-2"><Badge variant="secondary">{user.badges?.[0]}</Badge><span className="text-sm text-green-600 flex items-center gap-1"><FaChartLine /> +15% this week</span></div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-2">Next rank in</div>
                <div className="w-32"><Progress value={75} className="h-2" /><div className="text-xs text-gray-600 mt-1">750/1000 points</div></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Rankings</h2>
          <p className="text-gray-600">Top performers in the community</p>
        </div>
        <Select>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder={timePeriod} /></SelectTrigger>
          <SelectContent>
            {['weekly','monthly','quarterly','alltime'].map(v => <SelectItem key={v} value={v} onClick={() => setTimePeriod(v)}>{v === 'alltime' ? 'All Time' : `This ${v.charAt(0).toUpperCase()+v.slice(1)}`}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="learners" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="learners">Top Learners</TabsTrigger>
          <TabsTrigger value="creators">Top Creators</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="learners" className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FaTrophy className="text-yellow-500" /> Top Learners</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topLearners.map((learner) => (
                  <div key={learner.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center w-12 h-12">{rankIcon(learner.rank)}</div>
                    <Avatar className="w-12 h-12"><AvatarImage src={learner.avatar} /><AvatarFallback>{learner.name.charAt(0)}</AvatarFallback></Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1"><h4 className="font-semibold">{learner.name}</h4><Badge variant="secondary">{learner.level}</Badge><span className="text-sm text-green-600 flex items-center gap-1"><FaChartLine /> {learner.change}</span></div>
                      <div className="flex flex-wrap gap-1 mb-2">{learner.badges.slice(0, 2).map((b) => (<Badge key={b} variant="outline" className="text-xs">{b}</Badge>))}</div>
                      <div className="flex gap-4 text-sm text-gray-600"><span>{learner.sessionsAttended} sessions</span><span>{learner.questionsAsked} questions</span></div>
                    </div>
                    <div className="text-right"><div className="text-lg font-bold">{learner.points.toLocaleString()}</div><div className="text-sm text-gray-600">points</div></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creators" className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FaStar className="text-yellow-500" /> Top Creators</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCreators.map((creator) => (
                  <div key={creator.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center w-12 h-12">{rankIcon(creator.rank)}</div>
                    <Avatar className="w-12 h-12"><AvatarImage src={creator.avatar} /><AvatarFallback>{creator.name.charAt(0)}</AvatarFallback></Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1"><h4 className="font-semibold">{creator.name}</h4><div className="flex items-center gap-1"><FaStar className="text-yellow-400" /><span className="text-sm font-medium">{creator.rating}</span></div><span className="text-sm text-green-600 flex items-center gap-1"><FaChartLine /> {creator.change}</span></div>
                      <p className="text-sm text-gray-600 mb-2">{creator.specialty}</p>
                      <div className="flex flex-wrap gap-1 mb-2">{creator.badges.slice(0, 2).map((b) => (<Badge key={b} variant="outline" className="text-xs">{b}</Badge>))}</div>
                      <div className="flex gap-4 text-sm text-gray-600"><span>{creator.totalSessions} sessions</span><span>{creator.totalStudents} students</span></div>
                    </div>
                    <div className="text-right"><div className="text-lg font-bold">{creator.earnings}</div><div className="text-sm text-gray-600">earned</div></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="border-purple-200">
            <CardHeader><CardTitle className="flex items-center gap-2"><FaBullseye className="text-purple-600" /> Weekly Challenge</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div><h3 className="font-semibold mb-1">Knowledge Explorer Challenge</h3><p className="text-gray-600">Attend sessions in 3 different categories this week</p></div>
                <div className="space-y-2"><div className="flex justify-between text-sm"><span>Progress</span><span>2/3</span></div><Progress value={66} className="h-3" /></div>
                <div className="flex items-center justify-between"><div><p className="font-medium text-green-600">500 bonus points + Explorer badge</p><p className="text-sm text-gray-600">3 days left • 1247 participating</p></div></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FaAward className="text-yellow-500" /> Achievement Gallery</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((a) => {
                  const Icon = a.icon
                  return (
                    <div key={a.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${a.rarity === 'Legendary' ? 'bg-yellow-500' : a.rarity === 'Epic' ? 'bg-purple-500' : a.rarity === 'Rare' ? 'bg-blue-500' : 'bg-gray-500'}`}><Icon className="text-white" /></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1"><h4 className="font-semibold">{a.name}</h4><Badge variant="outline" className={`text-xs ${rarityColor(a.rarity)}`}>{a.rarity}</Badge></div>
                        <p className="text-sm text-gray-600 mb-1">{a.description}</p>
                        <p className="text-xs text-gray-600">{a.earned} users earned this</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Leaderboards


