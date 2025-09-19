import React, { useState } from 'react'
import { 
  Search, Filter, Calendar, Users, Star, Play, Clock, 
  Flame, BookOpen, User
} from 'lucide-react'

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
  const [showFilters, setShowFilters] = useState(false)

  const filteredSessions = allSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         session.creator.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || session.category === selectedCategory
    const matchesLevel = selectedLevel === 'All Levels' || session.level === selectedLevel
    const matchesView = viewMode === 'all' || 
                       (viewMode === 'live' && session.live) || 
                       (viewMode === 'trending' && session.trending) || 
                       (viewMode === 'upcoming' && !session.live)
    return matchesSearch && matchesCategory && matchesLevel && matchesView
  })

  const liveSessions = allSessions.filter(session => session.live)

  const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
      default: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50'
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors ${variants[variant]} ${className}`}>
        {children}
      </span>
    )
  }

  const Select = ({ children, value, onValueChange, className = '' }) => (
    <select 
      value={value} 
      onChange={(e) => onValueChange(e.target.value)}
      className={`px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    >
      {children}
    </select>
  )

  const tabItems = [
    { id: 'all', label: 'All Sessions', icon: BookOpen },
    { id: 'live', label: 'Live Now', icon: Play },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar }
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Discover Sessions</h1>
          <p className="text-lg text-gray-600">Find the perfect Q&A session to expand your knowledge and earn rewards</p>
        </div>

        {/* Live Sessions Alert */}
        {liveSessions.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <Play className="text-white h-5 w-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2 text-lg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    {liveSessions.length} Session{liveSessions.length > 1 ? 's' : ''} Live Now
                  </h3>
                  <p className="text-gray-600">Join ongoing Q&A sessions and interact with experts in real-time</p>
                </div>
              </div>
              <button 
                onClick={() => setViewMode('live')}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                View Live Sessions
              </button>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Search sessions, creators, or topics..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={selectedCategory} onValueChange={setSelectedCategory} className="min-w-[180px]">
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
              
              <Select value={selectedLevel} onValueChange={setSelectedLevel} className="min-w-[150px]">
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy} className="min-w-[180px]">
                {sortOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    viewMode === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Session Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map(session => (
              <div key={session.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={session.image} 
                    alt={session.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Live Badge */}
                  {session.live && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500 text-white hover:bg-red-600">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        LIVE
                      </Badge>
                    </div>
                  )}
                  
                  {/* Trending Badge */}
                  {!session.live && session.trending && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary">
                        <Flame className="h-3 w-3" />
                        Trending
                      </Badge>
                    </div>
                  )}
                  
                  {/* Category */}
                  <div className="absolute top-4 right-4">
                    <Badge>{session.category}</Badge>
                  </div>
                  
                  {/* Price */}
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                      ${session.price}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {session.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                          <img src={session.avatar} alt={session.creator} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm text-gray-600">{session.creator}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{session.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{session.live ? 'Live Now' : session.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{session.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{session.participants}/{session.maxParticipants}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{session.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{session.level}</Badge>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => alert(`${session.live ? 'Joining' : 'Booking'} session: ${session.title}`)}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        session.live 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {session.live ? (
                        <>
                          <Play className="h-4 w-4 fill-current" />
                          Join Live Session
                        </>
                      ) : (
                        'Book Session'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredSessions.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-500 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No sessions found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Explore