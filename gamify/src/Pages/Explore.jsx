import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ImageWithFallback } from './components/ImageWithFallback'
import { FaSearch, FaFilter, FaCalendarAlt, FaUsers, FaStar, FaPlay, FaClock, FaFire, FaBookOpen } from 'react-icons/fa'

const allSessions = [
  { id: 1, title: 'AI in Healthcare: Future Trends and Applications', creator: 'Dr. Sarah Chen', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face', date: '2024-01-10', time: '2:00 PM EST', duration: '60 min', participants: 156, maxParticipants: 200, category: 'Technology', level: 'Intermediate', price: 25, rating: 4.9, description: 'Explore how AI is revolutionizing healthcare with real-world examples and future predictions.', image: 'https://images.unsplash.com/photo-1585404544089-b386c0723dd4?q=80&w=1080&auto=format&fit=crop', trending: true, live: false },
  { id: 2, title: 'Startup Fundraising Masterclass', creator: 'Michael Torres', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', date: '2024-01-11', time: '4:00 PM EST', duration: '90 min', participants: 243, maxParticipants: 300, category: 'Business', level: 'Advanced', price: 35, rating: 4.8, description: 'Learn proven strategies for raising capital from a successful serial entrepreneur.', image: 'https://images.unsplash.com/photo-1555069855-e580a9adbf43?q=80&w=1080&auto=format&fit=crop', trending: true, live: false },
  { id: 3, title: 'Creative Writing Workshop: Character Development', creator: 'Emma Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', date: '2024-01-12', time: '6:00 PM EST', duration: '75 min', participants: 89, maxParticipants: 150, category: 'Creative', level: 'Beginner', price: 20, rating: 4.9, description: 'Master the art of creating compelling characters that readers will love.', image: 'https://images.unsplash.com/photo-1637743408313-c9d5e869d9db?q=80&w=1080&auto=format&fit=crop', trending: false, live: false },
  { id: 4, title: 'Cryptocurrency Investment Strategies - LIVE', creator: 'Alex Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', date: '2024-01-09', time: 'Now Live', duration: '45 min', participants: 1200, maxParticipants: 1500, category: 'Finance', level: 'Intermediate', price: 30, rating: 4.7, description: 'Live Q&A about current crypto market trends and investment strategies.', image: 'https://images.unsplash.com/photo-1608986596619-eb50cc56831f?q=80&w=1080&auto=format&fit=crop', trending: true, live: true },
  { id: 5, title: 'Digital Marketing in 2024: Latest Trends', creator: 'Jessica Park', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=100&h=100&fit=crop&crop=face', date: '2024-01-13', time: '3:00 PM EST', duration: '60 min', participants: 890, maxParticipants: 1000, category: 'Marketing', level: 'Intermediate', price: 28, rating: 4.8, description: 'Stay ahead with the latest digital marketing strategies and tools.', image: 'https://images.unsplash.com/photo-1583932692875-a42450d50acf?q=80&w=1080&auto=format&fit=crop', trending: false, live: false },
  { id: 6, title: 'React Performance Optimization', creator: 'David Singh', avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=100&h=100&fit=crop&crop=face', date: '2024-01-14', time: '1:00 PM EST', duration: '120 min', participants: 650, maxParticipants: 800, category: 'Technology', level: 'Advanced', price: 40, rating: 4.9, description: 'Deep dive into React performance optimization techniques and best practices.', image: 'https://images.unsplash.com/photo-1587279825909-6725a8a82e4e?q=80&w=1080&auto=format&fit=crop', trending: false, live: false }
]

const categories = ['All', 'Technology', 'Business', 'Creative', 'Finance', 'Marketing', 'Health']
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']
const sortOptions = ['Most Popular', 'Newest', 'Price: Low to High', 'Price: High to Low', 'Highest Rated']

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')
  const [sortBy, setSortBy] = useState('Most Popular')
  const [viewMode, setViewMode] = useState('all')

  const filteredSessions = allSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) || session.creator.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || session.category === selectedCategory
    const matchesLevel = selectedLevel === 'All Levels' || session.level === selectedLevel
    const matchesView = viewMode === 'all' || (viewMode === 'live' && session.live) || (viewMode === 'trending' && session.trending) || (viewMode === 'upcoming' && !session.live)
    return matchesSearch && matchesCategory && matchesLevel && matchesView
  })

  const liveSessions = allSessions.filter(session => session.live)

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Discover Sessions</h1>
          <p className="text-gray-600">Find the perfect Q&A session to expand your knowledge and earn rewards</p>
        </div>

        {liveSessions.length > 0 && (
          <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <FaPlay className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      {liveSessions.length} Session{liveSessions.length > 1 ? 's' : ''} Live Now
                    </h3>
                    <p className="text-sm text-gray-600">Join ongoing Q&A sessions and interact with experts in real-time</p>
                  </div>
                </div>
                <Button>View Live Sessions</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <Input placeholder="Search sessions, creators, or topics..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Select>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder={selectedCategory} /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c} value={c} onClick={() => setSelectedCategory(c)}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[150px]"><SelectValue placeholder={selectedLevel} /></SelectTrigger>
                  <SelectContent>
                    {levels.map(l => (
                      <SelectItem key={l} value={l} onClick={() => setSelectedLevel(l)}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder={sortBy} /></SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(o => (
                      <SelectItem key={o} value={o} onClick={() => setSortBy(o)}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm"><FaFilter className="mr-2" /> More Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="flex items-center gap-2"><FaBookOpen /> All Sessions</TabsTrigger>
            <TabsTrigger value="live" className="flex items-center gap-2"><FaPlay /> Live Now</TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2"><FaFire /> Trending</TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2"><FaCalendarAlt /> Upcoming</TabsTrigger>
          </TabsList>
          <TabsContent value={viewMode} className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">{filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} found</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions.map(session => (
                <Card key={session.id} className="group hover:shadow-lg transition-all duration-200">
                  <div className="relative">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <ImageWithFallback src={session.image} alt={session.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                      {session.live && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-red-500 hover:bg-red-600 flex items-center gap-1">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            LIVE
                          </Badge>
                        </div>
                      )}
                      {!session.live && session.trending && (
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <FaFire /> Trending
                          </Badge>
                        </div>
                      )}
                      <div className="absolute top-4 right-4"><Badge>{session.category}</Badge></div>
                      <div className="absolute bottom-4 left-4"><Badge variant="outline" className="bg-black/50 text-white border-white/20">${session.price}</Badge></div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{session.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="w-6 h-6"><AvatarImage src={session.avatar} /><AvatarFallback>{session.creator.charAt(0)}</AvatarFallback></Avatar>
                          <span className="text-sm text-gray-600">{session.creator}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{session.description}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-gray-600"><FaCalendarAlt /> <span>{session.live ? 'Live Now' : session.date}</span></div>
                          <div className="flex items-center gap-1 text-gray-600"><FaClock /> <span>{session.duration}</span></div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-gray-600"><FaUsers /> <span>{session.participants}/{session.maxParticipants}</span></div>
                          <div className="flex items-center gap-1"><FaStar className="text-yellow-400" /> <span className="text-sm font-medium">{session.rating}</span></div>
                        </div>
                        <div className="flex items-center gap-2"><Badge variant="outline" className="text-xs">{session.level}</Badge></div>
                      </div>
                      <Button className="w-full" asChild variant={session.live ? 'default' : 'outline'}>
                        <Link to={`/session/${session.id}`}>{session.live ? (<><FaPlay className="mr-2" /> Join Live Session</>) : 'Book Session'}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredSessions.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-gray-500 text-2xl" />
                </div>
                <h3 className="font-semibold mb-2">No sessions found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Explore