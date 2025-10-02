import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaPlay, FaUsers, FaTrophy, FaStar, FaCalendarAlt, FaArrowRight,
  FaCommentDots, FaBolt, FaShieldAlt, FaGift, FaCheckCircle,
  FaChartLine, FaClock, FaAward, FaBullseye, FaGlobe, FaBookOpen,
  FaVideo, FaChevronRight, FaQuoteRight, FaHeart, FaThumbsUp, FaCoins,
  FaSearch
} from 'react-icons/fa'

// Minimal badge/button/card components using Tailwind
const Badge = ({ children, className = '', variant = 'default' }) => (
  <span className={
    `inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ` +
    (variant === 'secondary'
      ? 'bg-gray-100 text-gray-800 '
      : variant === 'outline'
      ? 'border border-gray-300 text-gray-700 '
      : 'bg-gray-800 text-white '
    ) + className
  }>{children}</span>
)

const Button = ({ children, className = '', variant = 'default', size = 'md', ...props }) => (
  <button
    className={
      `inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ` +
      (size === 'lg' ? 'h-11 px-6 text-base ' : size === 'sm' ? 'h-8 px-3 text-sm ' : 'h-10 px-4 text-sm ') +
      (variant === 'outline'
        ? 'border border-gray-300 text-gray-800 hover:bg-gray-100 '
        : variant === 'secondary'
        ? 'bg-gray-800 text-white hover:bg-gray-900 '
        : 'bg-gray-700 text-white hover:bg-gray-800 '
      ) + className
    }
    {...props}
  >{children}</button>
)

const Card = ({ children, className = '', variant = 'default' }) => (
  <div className={
    `rounded-xl border transition-all duration-300 transform hover:scale-105 hover:shadow-lg ` +
    (variant === 'category'
      ? 'bg-gradient-to-br from-white to-gray-50 border-gray-200 '
      : 'bg-white border-gray-200 shadow-sm '
    ) + className
  }>{children}</div>
)

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
)

const Home = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [upcomingSessions, setUpcomingSessions] = useState([])
  const [trendingSessions, setTrendingSessions] = useState([])
  const [featuredCreators, setFeaturedCreators] = useState([])
  const [categories, setCategories] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [stats, setStats] = useState([])
  const [features, setFeatures] = useState([
    { icon: FaTrophy, title: 'Earn as You Learn', description: 'Get rewarded with points for every question asked, answer provided, and session attended.', benefits: ['10-50 points per session', 'Bonus for top questions', 'Weekly achievement rewards'] },
    { icon: FaUsers, title: 'Connect with Experts', description: 'Direct access to industry leaders, successful entrepreneurs, and domain specialists.', benefits: ['1-on-1 expert sessions', 'Group discussions', 'Mentorship opportunities'] },
    { icon: FaBullseye, title: 'Personalized Learning', description: 'AI-powered recommendations based on your interests, goals, and learning progress.', benefits: ['Custom session feeds', 'Skill-based matching', 'Progress tracking'] },
    { icon: FaGlobe, title: 'Global Community', description: 'Join learners from around the world in collaborative learning experiences.', benefits: ['24/7 global sessions', 'Cross-cultural insights', 'Diverse perspectives'] }
  ])
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from local db.json file
        const response = await fetch('./db.json')
        const data = await response.json()

        const { users, sessions, leaderboards, liveSessions } = data
        const currentDate = new Date('2025-09-24')

        // Upcoming Sessions - use sessions data from db.json
        const upcoming = sessions
          .filter(session => {
            const sessionDate = new Date(session.date)
            return sessionDate > currentDate && !session.live
          })
          .slice(0, 3)
          .map(session => {
            const creator = users.find(user => user.username === session.creator)
            return {
              id: session.id,
              title: session.title,
              creator: session.creator,
              avatar: session.avatar,
              date: session.date,
              time: session.time,
              participants: session.participants,
              category: session.category,
              image: session.image,
              rating: session.rating,
              live: session.live
            }
          })
        setUpcomingSessions(upcoming)

        // Trending Sessions - use sessions data sorted by participants
        const trending = sessions
          .filter(session => !session.live)
          .sort((a, b) => b.participants - a.participants)
          .slice(0, 3)
          .map(session => ({
            id: session.id,
            title: session.title,
            creator: session.creator,
            participants: session.participants,
            rating: session.rating,
            category: session.category
          }))
        setTrendingSessions(trending)

        // Featured Creators - use top users from db.json
        const featured = users
          .sort((a, b) => b.performance.averageRating - a.performance.averageRating)
          .slice(0, 4)
          .map(user => ({
            id: user.id,
            name: user.username,
            avatar: user.profile.avatar,
            specialty: user.achievements.badges[0] || 'Expert',
            rating: user.performance.averageRating,
            sessions: user.content.schedule.length,
            badges: user.achievements.badges
          }))
        setFeaturedCreators(featured)

        // Categories - extract unique categories from sessions
        const allCategories = new Set()
        sessions.forEach(session => {
          if (session.category) allCategories.add(session.category)
        })

        const catData = Array.from(allCategories).map((cat, i) => {
          const categorySessions = sessions.filter(s => s.category === cat)
          const iconMap = {
            'Technology': FaBolt,
            'Business': FaTrophy,
            'Creative': FaGift,
            'Finance': FaShieldAlt,
            'Marketing': FaCommentDots,
            'General': FaUsers
          }
          const Icon = iconMap[cat] || FaUsers

          return {
            name: cat,
            icon: Icon,
            count: categorySessions.length * 10,
            description: `Explore ${cat.toLowerCase()} with top experts and engaging sessions.`,
            highlight: `Top session: ${cat} Masterclass`,
            color: 'border-gray-200',
            bgColor: 'bg-gray-800'
          }
        })
        setCategories(catData)

        // Testimonials - use top users as testimonials
        const tests = users.slice(0, 3).map(user => ({
          id: user.id,
          name: user.username,
          avatar: user.profile.avatar,
          role: user.achievements.badges[0] || 'Learner',
          content: user.profile.bio,
          rating: Math.round(user.performance.averageRating),
          points: user.achievements.points
        }))
        setTestimonials(tests)

        // Stats - calculate from db.json data
        const totalSessions = sessions.length
        const totalPoints = users.reduce((acc, u) => acc + u.achievements.points, 0)
        const totalSuccess = leaderboards.achievements.available.reduce((acc, a) => acc + a.earnedBy, 0)
        setStats([
          { label: 'Active Learners', value: `${users.length}+`, icon: FaUsers },
          { label: 'Expert Sessions', value: `${totalSessions}+`, icon: FaVideo },
          { label: 'Points Earned', value: `${(totalPoints / 1000).toFixed(1)}K+`, icon: FaTrophy },
          { label: 'Success Stories', value: `${totalSuccess}+`, icon: FaAward }
        ])

        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (testimonials.length > 0) {
      const id = setInterval(() => {
        setCurrentTestimonial((p) => (p + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(id)
    }
  }, [testimonials])

  const handleGetStarted = () => {
    navigate('/register')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  if (isLoading) {
    return <div className="text-center py-20">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">  {/* Added overflow-x-hidden */}
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <FaBolt className="h-3 w-3 mr-1" />
                Join {stats[0]?.value || '10+'} Active Learners
              </Badge>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                Learn from Experts, Earn Rewards
              </h1>
              <p className="text-base text-gray-600 max-w-md">
                Join interactive Q&A sessions with industry leaders. Ask questions, get personalized answers, and earn points for your active participation in our gamified learning platform.
              </p>
              <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search sessions..."
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  aria-label="Search sessions"
                />
                <Button type="submit" size="md">
                  <FaSearch className="mr-2" />
                  Search
                </Button>
              </form>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="md" onClick={handleGetStarted} className="shadow-lg">
                  Get Started Free
                  <FaArrowRight className="ml-2" />
                </Button>
                <Button size="md" variant="outline">
                  <Link to="/explore" className="inline-flex items-center">
                    <FaPlay className="mr-2" />
                    Watch Demo
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
                {stats.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <div key={i} className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Icon className="text-gray-600" />
                        </div>
                      </div>
                      <div className="font-bold text-base text-gray-900">{s.value}</div>
                      <div className="text-xs text-gray-500">{s.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-square max-w-sm mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl rotate-6" />
                <div className="relative bg-white rounded-3xl p-4 shadow-2xl border border-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1622675363311-3e1904dc1885?q=80&w=1080&auto=format&fit=crop"
                    alt="Diverse professionals in online meeting"
                    className="w-full h-40 object-cover rounded-2xl"
                  />
                  <div className="absolute -top-3 -right-3 bg-gray-800 text-white rounded-full p-2 shadow-lg">
                    <FaTrophy />
                  </div>
                  <div className="absolute -bottom-3 -left-3 bg-gray-800 text-white rounded-full p-2 shadow-lg">
                    <FaUsers />
                  </div>
                  <div className="absolute top-3 left-3 bg-gray-100 text-gray-900 rounded-full px-2 py-1 text-xs font-medium shadow-lg">
                    +25 Points
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-3 mb-8">
            <Badge variant="outline" className="mb-3">
              <FaBullseye className="h-3 w-3 mr-1" />
              Platform Features
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Why Choose Our Platform?</h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">Experience the future of learning with our gamified, interactive Q&A platform</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <Card key={i} className="relative overflow-hidden transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Icon className="text-gray-600 text-lg" />
                      </div>
                      <div className="space-y-2">
                        <div>
                          <h3 className="text-lg font-semibold mb-1 text-gray-900">{f.title}</h3>
                          <p className="text-gray-600 text-sm">{f.description}</p>
                        </div>
                        <ul className="space-y-1">
                          {f.benefits.map((b, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs">
                              <FaCheckCircle className="text-green-500" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Sessions */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge variant="outline" className="mb-1">
                <FaCalendarAlt className="h-3 w-3 mr-1" />
                Live Sessions
              </Badge>
              <h2 className="text-2xl font-bold mb-1 text-gray-900">Upcoming Sessions</h2>
              <p className="text-gray-600 text-sm">Join live Q&A sessions with industry experts</p>
            </div>
            <Button variant="outline" size="sm" className="group">
              <Link to="/explore" className="inline-flex items-center">
                View All Sessions
                <FaChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingSessions.map((s) => (
              <Card key={s.id} className="h-full transition-all duration-300">
                <div className="aspect-video relative overflow-hidden rounded-t-xl">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-3 left-3"><Badge className="bg-gray-800 text-white text-xs">{s.category}</Badge></div>
                  <div className="absolute top-3 right-3"><Badge variant="secondary" className="bg-gray-800 text-white text-xs">Live</Badge></div>
                  <div className="absolute bottom-3 right-3"><Badge variant="secondary" className="bg-gray-800 text-white text-xs">+15 pts</Badge></div>
                </div>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold mb-1 text-gray-900 text-sm">{s.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <img src={s.avatar} className="w-6 h-6 rounded-full ring-2 ring-gray-200 object-cover" />
                        <div>
                          <span className="text-xs font-medium">{s.creator}</span>
                          <div className="flex items-center gap-1">
                            {Array.from({length: Math.round(s.rating || 4)}).map((_, i) => (
                              <FaStar key={i} className="text-yellow-400 text-xs" />
                            ))}
                            <span className="text-xs text-gray-500">{s.rating?.toFixed(1) || '4.0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-gray-600">
                        <div className="flex items-center gap-1"><FaCalendarAlt /> <span>{s.date}</span></div>
                        <div className="flex items-center gap-1"><FaClock /> <span>{s.time}</span></div>
                      </div>
                      <div className="flex items-center justify-between text-gray-700">
                        <div className="flex items-center gap-1 text-gray-600"><FaUsers /> <span>{s.participants} joined</span></div>
                        <div className="flex items-center gap-1 text-gray-600"><FaTrophy /> <span>15-25 pts</span></div>
                      </div>
                    </div>
                    <Button className="w-full" size="sm">
                      Join Session
                      <FaArrowRight className="ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-2 mb-8">
            <Badge variant="outline" className="mb-1">
              <FaChartLine className="h-3 w-3 mr-1" />
              Hot Topics
            </Badge>
            <h2 className="text-2xl font-bold text-gray-900">Trending This Week</h2>
            <p className="text-gray-600 text-sm">Most popular sessions based on participant engagement</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingSessions.map((s, idx) => (
              <Card key={s.id} className="relative">
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">#{idx + 1}</div>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">{s.category}</Badge>
                        <Badge variant="outline" className="text-xs"><FaChartLine className="h-3 w-3 mr-1" /> Trending</Badge>
                      </div>
                      <h3 className="font-semibold mb-1 text-gray-900 text-sm">{s.title}</h3>
                      <p className="text-xs text-gray-600">by {s.creator}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-gray-600 text-xs">
                          <FaUsers />
                          <span className="font-medium">{s.participants.toLocaleString()}</span>
                          <span className="text-gray-500">learners</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400" />
                          <span className="font-medium text-xs">{s.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1"><FaThumbsUp /> <span>98% positive</span></div>
                        <span>•</span>
                        <div className="flex items-center gap-1"><FaTrophy /> <span>20-35 pts</span></div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full text-xs">
                      View Session
                      <FaArrowRight className="ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experts */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-2 mb-8">
            <Badge variant="outline" className="mb-1">
              <FaAward className="h-3 w-3 mr-1" />
              Expert Network
            </Badge>
            <h2 className="text-2xl font-bold text-gray-900">Featured Experts</h2>
            <p className="text-gray-600 text-sm">Learn from industry leaders and successful professionals</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCreators.map((c) => (
              <Card key={c.id} className="text-center">
                <CardContent>
                  <div className="relative mb-4">
                    <img src={c.avatar} className="w-16 h-16 mx-auto rounded-full ring-4 ring-gray-200 object-cover" />
                    <div className="absolute -top-1 -right-1 bg-gray-800 rounded-full p-1 shadow-lg"><FaAward className="text-white text-xs" /></div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-semibold mb-1 text-gray-900 text-sm">{c.name}</h3>
                      <p className="text-xs text-gray-600">{c.specialty}</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-xs">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1"><FaStar className="text-yellow-400" /><span className="font-medium">{c.rating.toFixed(1)}</span></div>
                        <span className="text-gray-500">Rating</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1"><FaVideo className="text-gray-600" /><span className="font-medium">{c.sessions}</span></div>
                        <span className="text-gray-500">Sessions</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {c.badges.map((b) => (<Badge key={b} variant="secondary" className="text-xs">{b}</Badge>))}
                    </div>
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      <Link to={`/creator/${c.id}`} className="inline-flex items-center w-full justify-center">
                        View Profile
                        <FaChevronRight className="ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-1">
              <FaHeart className="h-3 w-3 mr-1" />
              User Stories
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What Our Learners Say</h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">Join thousands of successful learners who have transformed their careers</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Card className="relative overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="text-center space-y-4">
                  <FaQuoteRight className="text-gray-400 text-3xl mx-auto" />
                  <blockquote className="text-base md:text-lg italic text-gray-700">"{testimonials[currentTestimonial]?.content}"</blockquote>
                  <div className="flex items-center justify-center gap-3">
                    <img src={testimonials[currentTestimonial]?.avatar} className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-200" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 text-sm">{testimonials[currentTestimonial]?.name}</div>
                      <div className="text-xs text-gray-600">{testimonials[currentTestimonial]?.role}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {Array.from({length: testimonials[currentTestimonial]?.rating || 4}).map((_, i) => (
                            <FaStar key={i} className="text-yellow-400 text-xs" />
                          ))}
                        </div>
                        <Badge variant="secondary" className="text-xs"><FaCoins className="mr-1" />{testimonials[currentTestimonial]?.points} pts</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-2">
                    {testimonials.map((_, i) => (
                      <button key={i} className={`w-2 h-2 rounded-full ${i === currentTestimonial ? 'bg-gray-800' : 'bg-gray-300'}`} onClick={() => setCurrentTestimonial(i)} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-2 mb-8">
            <Badge variant="outline" className="mb-1">
              <FaBookOpen className="h-3 w-3 mr-1" />
              Learning Categories
            </Badge>
            <h2 className="text-2xl font-bold text-gray-900">Browse by Interest</h2>
            <p className="text-gray-600 text-sm">Find sessions perfectly matched to your learning goals</p>
          </div>
          <div className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {categories.map((c) => {
              const Icon = c.icon
              return (
                <Card key={c.name} variant="category" className="flex-none w-72 snap-start border-2 border-gray-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-800 w-10 h-10 rounded-xl flex items-center justify-center">
                          <Icon className="text-white text-lg" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base text-gray-900">{c.name}</h3>
                          <p className="text-xs text-gray-600">{c.count} active sessions</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{c.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">{c.highlight}</div>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Link to={`/category/${c.name.toLowerCase()}`} className="inline-flex items-center">
                            Explore
                            <FaChevronRight className="ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-1">
              <FaBullseye className="h-3 w-3 mr-1" />
              Simple Process
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">Start earning points and learning from experts in just 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Sign Up & Explore', description: 'Create your free account and browse sessions from top experts in your field', icon: FaUsers },
              { step: '02', title: 'Join & Participate', description: 'Ask questions, engage in discussions, and learn from real-world experiences', icon: FaCommentDots },
              { step: '03', title: 'Earn & Grow', description: 'Collect points, unlock badges, and advance your career with new knowledge', icon: FaTrophy }
            ].map((it, idx) => {
              const Icon = it.icon
              return (
                <div key={idx} className="text-center relative">
                  {idx < 2 && (<div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-500/50 to-transparent" />)}
                  <div className="relative">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Icon className="text-gray-600 text-xl" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-white">{it.step}</div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{it.title}</h3>
                  <p className="text-gray-600 text-sm">{it.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="mb-1 bg-gray-800 text-white">
                <FaBolt className="h-3 w-3 mr-1" />
                Join the Revolution
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Ready to Transform Your Learning Journey?</h2>
              <p className="text-base text-gray-600 max-w-xl mx-auto">Join over {stats[0]?.value || '10+'} successful learners who are earning rewards while gaining valuable knowledge from industry experts. Start your journey today!</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="md" variant="secondary" onClick={handleGetStarted} className="shadow-lg">
                Get Started Free
                <FaArrowRight className="ml-1" />
              </Button>
              <Button size="md" variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                <Link to="/explore" className="inline-flex items-center">
                  <FaBookOpen className="mr-2" />
                  Explore Sessions
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home