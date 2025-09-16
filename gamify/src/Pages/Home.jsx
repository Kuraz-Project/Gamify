import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {
  FaPlay, FaUsers, FaTrophy, FaStar, FaCalendarAlt, FaArrowRight,
  FaCommentDots, FaBolt, FaShieldAlt, FaGift, FaCheckCircle,
  FaChartLine, FaClock, FaAward, FaBullseye, FaGlobe, FaBookOpen,
  FaVideo, FaChevronRight, FaQuoteRight, FaHeart, FaThumbsUp, FaCoins
} from 'react-icons/fa'

// Minimal badge/button/card components using Tailwind
const Badge = ({children, className = '', variant = 'default'}) => (
  <span className={
    `inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ` +
    (variant === 'secondary'
      ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 '
      : variant === 'outline'
      ? 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-200 '
      : 'bg-blue-600 text-white '
    ) + className
  }>{children}</span>
)

const Button = ({children, className = '', variant = 'default', size = 'md', ...props}) => (
  <button
    className={
      `inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ` +
      (size === 'lg' ? 'h-11 px-6 text-base ' : size === 'sm' ? 'h-8 px-3 text-sm ' : 'h-10 px-4 text-sm ') +
      (variant === 'outline'
        ? 'border border-gray-300 text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 '
        : variant === 'secondary'
        ? 'bg-gray-900 text-white hover:bg-black dark:bg-gray-100 dark:text-gray-900 '
        : 'bg-blue-600 text-white hover:bg-blue-700 '
      ) + className
    }
    {...props}
  >{children}</button>
)

const Card = ({children, className = ''}) => (
  <div className={`rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}>{children}</div>
)
const CardContent = ({children, className = ''}) => (
  <div className={`p-6 ${className}`}>{children}</div>
)

const upcomingSessions = [
  {
    id: 1,
    title: 'AI in Healthcare: Future Trends',
    creator: 'Dr. Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
    date: '2024-01-10',
    time: '2:00 PM EST',
    participants: 156,
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1585404544089-b386c0723dd4?q=80&w=1080&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Startup Fundraising Masterclass',
    creator: 'Michael Torres',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    date: '2024-01-11',
    time: '4:00 PM EST',
    participants: 243,
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1555069855-e580a9adbf43?q=80&w=1080&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Creative Writing Workshop',
    creator: 'Emma Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    date: '2024-01-12',
    time: '6:00 PM EST',
    participants: 89,
    category: 'Creative',
    image: 'https://images.unsplash.com/photo-1637743408313-c9d5e869d9db?q=80&w=1080&auto=format&fit=crop'
  }
]

const trendingSessions = [
  {id: 4, title: 'Cryptocurrency Investment Strategies', creator: 'Alex Kim', participants: 1200, rating: 4.9, category: 'Finance'},
  {id: 5, title: 'Digital Marketing in 2024', creator: 'Jessica Park', participants: 890, rating: 4.8, category: 'Marketing'},
  {id: 6, title: 'React Performance Optimization', creator: 'David Singh', participants: 650, rating: 4.9, category: 'Technology'}
]

const featuredCreators = [
  {id: 1, name: 'Dr. Sarah Chen', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face', specialty: 'AI & Healthcare', rating: 4.9, sessions: 45, badges: ['Expert', 'Top Rated']},
  {id: 2, name: 'Michael Torres', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', specialty: 'Startup Strategy', rating: 4.8, sessions: 32, badges: ['Entrepreneur', 'Mentor']},
  {id: 3, name: 'Emma Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', specialty: 'Creative Writing', rating: 4.9, sessions: 28, badges: ['Author', 'Creative']},
  {id: 4, name: 'Alex Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', specialty: 'Fintech & Crypto', rating: 4.7, sessions: 38, badges: ['Analyst', 'Investor']}
]

const categories = [
  {name: 'Technology', icon: FaBolt, count: 234, color: 'bg-blue-500'},
  {name: 'Business', icon: FaTrophy, count: 189, color: 'bg-green-500'},
  {name: 'Creative', icon: FaGift, count: 156, color: 'bg-purple-500'},
  {name: 'Finance', icon: FaShieldAlt, count: 143, color: 'bg-yellow-500'},
  {name: 'Marketing', icon: FaCommentDots, count: 98, color: 'bg-red-500'},
  {name: 'Health', icon: FaUsers, count: 87, color: 'bg-teal-500'}
]

const testimonials = [
  {id: 1, name: 'Sarah Mitchell', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b60340e2?w=100&h=100&fit=crop&crop=face', role: 'Software Engineer at Google', content: "The Q&A sessions have been incredible for my career growth. I've earned over 3,000 points while learning from industry experts!", rating: 5, points: 3250},
  {id: 2, name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', role: 'Marketing Director', content: 'This platform transformed how I approach continuous learning. The gamification keeps me engaged and motivated.', rating: 5, points: 2890},
  {id: 3, name: 'Elena Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', role: 'Startup Founder', content: 'Connected with amazing mentors and got crucial advice for my startup. The community here is genuinely supportive.', rating: 5, points: 4150}
]

const stats = [
  {label: 'Active Learners', value: '12,500+', icon: FaUsers},
  {label: 'Expert Sessions', value: '850+', icon: FaVideo},
  {label: 'Points Earned', value: '2.5M+', icon: FaTrophy},
  {label: 'Success Stories', value: '4,200+', icon: FaAward}
]

const features = [
  {icon: FaTrophy, title: 'Earn as You Learn', description: 'Get rewarded with points for every question asked, answer provided, and session attended.', benefits: ['10-50 points per session', 'Bonus for top questions', 'Weekly achievement rewards']},
  {icon: FaUsers, title: 'Connect with Experts', description: 'Direct access to industry leaders, successful entrepreneurs, and domain specialists.', benefits: ['1-on-1 expert sessions', 'Group discussions', 'Mentorship opportunities']},
  {icon: FaBullseye, title: 'Personalized Learning', description: 'AI-powered recommendations based on your interests, goals, and learning progress.', benefits: ['Custom session feeds', 'Skill-based matching', 'Progress tracking']},
  {icon: FaGlobe, title: 'Global Community', description: 'Join learners from around the world in collaborative learning experiences.', benefits: ['24/7 global sessions', 'Cross-cultural insights', 'Diverse perspectives']}
]

const Home = () => {
  const navigate = useNavigate()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTestimonial((p) => (p + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const handleGetStarted = () => {
    navigate('/register')
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/10" />
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="secondary" className="w-fit">
                <FaBolt className="h-3 w-3 mr-1" />
                Join 12,500+ Active Learners
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Learn from Experts, <span className="text-blue-600">Earn Rewards</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Join interactive Q&A sessions with industry leaders. Ask questions, get personalized answers, and earn points for your active participation in our gamified learning platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={handleGetStarted} className="shadow-lg">
                  Get Started Free
                  <FaArrowRight className="ml-2" />
                </Button>
                <Button size="lg" variant="outline" as="span">
                  <Link to="/explore" className="inline-flex items-center">
                    <FaPlay className="mr-2" />
                    Watch Demo
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((s) => {
                  const Icon = s.icon
                  return (
                    <div key={s.label} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-8 h-8 bg-blue-600/10 rounded-full flex items-center justify-center">
                          <Icon className="text-blue-600" />
                        </div>
                      </div>
                      <div className="font-bold text-lg">{s.value}</div>
                      <div className="text-sm text-gray-500">{s.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl rotate-6" />
                <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1622675363311-3e1904dc1885?q=80&w=1080&auto=format&fit=crop"
                    alt="Diverse professionals in online meeting"
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                  <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full p-3 shadow-lg">
                    <FaTrophy />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white rounded-full p-3 shadow-lg">
                    <FaUsers />
                  </div>
                  <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 rounded-full px-3 py-1 text-sm font-medium shadow-lg">
                    +25 Points
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="mb-4">
              <FaBullseye className="h-3 w-3 mr-1" />
              Platform Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose Our Platform?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Experience the future of learning with our gamified, interactive Q&A platform</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <Card key={i} className="relative overflow-hidden transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                        <Icon className="text-blue-600 text-3xl" />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                          <p className="text-gray-600">{f.description}</p>
                        </div>
                        <ul className="space-y-2">
                          {f.benefits.map((b, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
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
      <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge variant="outline" className="mb-2">
                <FaCalendarAlt className="h-3 w-3 mr-1" />
                Live Sessions
              </Badge>
              <h2 className="text-3xl font-bold mb-1">Upcoming Sessions</h2>
              <p className="text-gray-600">Join live Q&A sessions with industry experts</p>
            </div>
            <Button variant="outline" as="span" className="group">
              <Link to="/explore" className="inline-flex items-center">
                View All Sessions
                <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingSessions.map((s) => (
              <Card key={s.id} className="h-full transition-all duration-300">
                <div className="aspect-video relative overflow-hidden rounded-t-xl">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 left-4"><Badge className="bg-blue-600 text-white">{s.category}</Badge></div>
                  <div className="absolute top-4 right-4"><Badge variant="secondary" className="bg-green-500 text-white">Live</Badge></div>
                  <div className="absolute bottom-4 right-4"><Badge variant="secondary" className="bg-black/50 text-white">+15 pts</Badge></div>
                </div>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">{s.title}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <img src={s.avatar} className="w-8 h-8 rounded-full ring-2 ring-gray-200 object-cover" />
                        <div>
                          <span className="text-sm font-medium">{s.creator}</span>
                          <div className="flex items-center gap-1">
                            {Array.from({length: 5}).map((_, i) => (
                              <FaStar key={i} className="text-yellow-400" />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">4.9</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between text-gray-600">
                        <div className="flex items-center gap-1"><FaCalendarAlt /> <span>{s.date}</span></div>
                        <div className="flex items-center gap-1"><FaClock /> <span>{s.time}</span></div>
                      </div>
                      <div className="flex items-center justify-between text-gray-700">
                        <div className="flex items-center gap-1 text-green-600"><FaUsers /> <span>{s.participants} joined</span></div>
                        <div className="flex items-center gap-1 text-yellow-600"><FaTrophy /> <span>15-25 pts</span></div>
                      </div>
                    </div>
                    <Button className="w-full" size="sm">
                      Join Session
                      <FaArrowRight className="ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-2 mb-12">
            <Badge variant="outline" className="mb-2"><FaChartLine className="h-3 w-3 mr-1" /> Hot Topics</Badge>
            <h2 className="text-3xl font-bold">Trending This Week</h2>
            <p className="text-gray-600">Most popular sessions based on participant engagement</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {trendingSessions.map((s, idx) => (
              <Card key={s.id} className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">#{idx + 1}</div>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">{s.category}</Badge>
                        <Badge variant="outline" className="text-xs"><FaChartLine className="h-3 w-3 mr-1" /> Trending</Badge>
                      </div>
                      <h3 className="font-semibold mb-2">{s.title}</h3>
                      <p className="text-sm text-gray-600">by {s.creator}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-green-600">
                          <FaUsers />
                          <span className="text-sm font-medium">{s.participants.toLocaleString()}</span>
                          <span className="text-xs text-gray-500">learners</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400" />
                          <span className="text-sm font-medium">{s.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1"><FaThumbsUp /> <span>98% positive</span></div>
                        <span>•</span>
                        <div className="flex items-center gap-1"><FaTrophy /> <span>20-35 pts</span></div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View Session
                      <FaArrowRight className="ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experts */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-2 mb-12">
            <Badge variant="outline" className="mb-2"><FaAward className="h-3 w-3 mr-1" /> Expert Network</Badge>
            <h2 className="text-3xl font-bold">Featured Experts</h2>
            <p className="text-gray-600">Learn from industry leaders and successful professionals</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCreators.map((c) => (
              <Card key={c.id} className="text-center">
                <CardContent>
                  <div className="relative mb-6">
                    <img src={c.avatar} className="w-24 h-24 mx-auto rounded-full ring-4 ring-gray-200 object-cover" />
                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg"><FaAward className="text-white" /></div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold mb-1">{c.name}</h3>
                      <p className="text-sm text-gray-600">{c.specialty}</p>
                    </div>
                    <div className="flex items-center justify-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1"><FaStar className="text-yellow-400" /><span className="font-medium">{c.rating}</span></div>
                        <span className="text-xs text-gray-500">Rating</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1"><FaVideo className="text-blue-500" /><span className="font-medium">{c.sessions}</span></div>
                        <span className="text-xs text-gray-500">Sessions</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {c.badges.map((b) => (<Badge key={b} variant="secondary" className="text-xs">{b}</Badge>))}
                    </div>
                    <Button size="sm" variant="outline" className="w-full" as="span">
                      <Link to={`/creator/${c.id}`} className="inline-flex items-center w-full justify-center">
                        View Profile
                        <FaChevronRight className="ml-2" />
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
      <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-2"><FaHeart className="h-3 w-3 mr-1" /> User Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">What Our Learners Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Join thousands of successful learners who have transformed their careers</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-6">
                  <FaQuoteRight className="text-blue-600/30 text-4xl mx-auto" />
                  <blockquote className="text-lg md:text-xl italic">"{testimonials[currentTestimonial].content}"</blockquote>
                  <div className="flex items-center justify-center gap-4">
                    <img src={testimonials[currentTestimonial].avatar} className="h-16 w-16 rounded-full object-cover" />
                    <div className="text-left">
                      <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                      <div className="text-sm text-gray-600">{testimonials[currentTestimonial].role}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {Array.from({length: testimonials[currentTestimonial].rating}).map((_, i) => (
                            <FaStar key={i} className="text-yellow-400" />
                          ))}
                        </div>
                        <Badge variant="secondary" className="text-xs"><FaCoins className="mr-1" />{testimonials[currentTestimonial].points} pts</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-2">
                    {testimonials.map((_, i) => (
                      <button key={i} className={`w-2 h-2 rounded-full ${i === currentTestimonial ? 'bg-blue-600' : 'bg-gray-400/40'}`} onClick={() => setCurrentTestimonial(i)} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-2 mb-12">
            <Badge variant="outline" className="mb-2"><FaBookOpen className="h-3 w-3 mr-1" /> Learning Categories</Badge>
            <h2 className="text-3xl font-bold">Browse by Interest</h2>
            <p className="text-gray-600">Find sessions perfectly matched to your learning goals</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c) => {
              const Icon = c.icon
              return (
                <Card key={c.name} className="cursor-pointer">
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 ${c.color} rounded-2xl flex items-center justify-center`}>
                        <Icon className="text-white text-2xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{c.name}</h3>
                        <p className="text-sm text-gray-600">{c.count} active sessions</p>
                        <div className="flex items-center gap-1 mt-1 text-green-600 text-xs"><FaChartLine /> <span>Growing community</span></div>
                      </div>
                      <FaChevronRight className="text-gray-500" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-2"><FaBullseye className="h-3 w-3 mr-1" /> Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Start earning points and learning from experts in just 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {step: '01', title: 'Sign Up & Explore', description: 'Create your free account and browse sessions from top experts in your field', icon: FaUsers},
              {step: '02', title: 'Join & Participate', description: 'Ask questions, engage in discussions, and learn from real-world experiences', icon: FaCommentDots},
              {step: '03', title: 'Earn & Grow', description: 'Collect points, unlock badges, and advance your career with new knowledge', icon: FaTrophy}
            ].map((it, idx) => {
              const Icon = it.icon
              return (
                <div key={idx} className="text-center relative">
                  {idx < 2 && (<div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent" />)}
                  <div className="relative">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Icon className="text-white text-3xl" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">{it.step}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{it.title}</h3>
                  <p className="text-gray-600">{it.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-600/90 to-blue-600/80 text-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="space-y-3">
              <Badge variant="secondary" className="mb-2 bg-white text-gray-900">
                <FaBolt className="h-3 w-3 mr-1" />
                Join the Revolution
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold">Ready to Transform Your Learning Journey?</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">Join over 12,500 successful learners who are earning rewards while gaining valuable knowledge from industry experts. Start your journey today!</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={handleGetStarted} className="shadow-lg">
                Get Started Free
                <FaArrowRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" as="span">
                <Link to="/explore" className="inline-flex items-center">
                  <FaBookOpen className="mr-2" />
                  Explore Sessions
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 opacity-90">
              <div className="text-center"><div className="text-2xl font-bold">12,500+</div><div className="text-sm">Active Learners</div></div>
              <div className="text-center"><div className="text-2xl font-bold">850+</div><div className="text-sm">Expert Sessions</div></div>
              <div className="text-center"><div className="text-2xl font-bold">2.5M+</div><div className="text-sm">Points Earned</div></div>
              <div className="text-center"><div className="text-2xl font-bold">98%</div><div className="text-sm">Satisfaction Rate</div></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home


