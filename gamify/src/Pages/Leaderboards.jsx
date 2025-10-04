import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../App'
import { FaTrophy, FaMedal, FaCrown, FaChartLine, FaStar, FaAward, FaBullseye, FaSearch, FaSort, FaShare, FaDownload, FaEye, FaUsers, FaClock, FaLongArrowAltUp, FaFilter } from 'react-icons/fa'
import { Tooltip } from 'react-tooltip'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

// Consistent components from previous updates
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

// Constants
const TIME_PERIODS = ['weekly', 'monthly', 'quarterly', 'alltime']
const RARITY_COLORS = {
  Legendary: 'text-yellow-600 bg-yellow-500',
  Epic: 'text-purple-600 bg-purple-500',
  Rare: 'text-blue-600 bg-blue-500',
  Common: 'text-gray-600 bg-gray-500',
}
const ITEMS_PER_PAGE = 5

// Rank icon helper
const rankIcon = (rank) => {
  if (rank === 1) return <FaCrown className="text-yellow-500 text-3xl" />
  if (rank === 2) return <FaMedal className="text-gray-400 text-3xl" />
  if (rank === 3) return <FaMedal className="text-amber-600 text-3xl" />
  return <span className="text-lg font-bold text-gray-500">#{rank}</span>
}


// Sub-components
const UserCard = ({ user, type, index, viewMode = 'detailed' }) => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(`/ViewProfile/${user.id}`)
  }
  if (viewMode === 'compact') {
    return (
      <Card className="hover:shadow-md">
        <CardContent className="p-4">
          <div
            className="flex items-center gap-4"
            data-tooltip-id={`tooltip-${type}-${user.id}`}
          >
            <div className="flex items-center justify-center w-10 h-10">{rankIcon(user.rank)}</div>
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
              loading="lazy"
              onError={(e) => (e.target.src = `https://ui-avatars.com/api/?name=${user.name[0]}`)}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-base truncate">{user.name}</h4>
                {type === 'learner' ? (
                  <Badge variant="secondary" className="text-xs">
                    {user.level}
                  </Badge>
                ) : (
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="text-xs font-medium">{user.rating}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="text-green-600 flex items-center gap-1">
                  <FaChartLine className="text-xs" /> {user.change}
                </span>
                <span>{type === 'learner' ? `${user.sessionsAttended}s` : `${user.totalSessions}s`}</span>
                <span>{type === 'learner' ? `${user.questionsAsked}q` : `${user.totalStudents}st`}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold">{type === 'learner' ? user.points.toLocaleString() : user.earnings}</div>
            </div>
            <Tooltip id={`tooltip-${type}-${user.id}`} content={`${user.name}'s Profile - Click for details`} place="top" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md" >
      <CardContent className="p-6" >
        <div
          className="flex items-center gap-6 cursor-pointer"
          data-tooltip-id={`tooltip-${type}-${user.id}`}
          onClick={handleClick}
        >
          <div className="flex items-center justify-center w-14 h-14">{rankIcon(user.rank)}</div>
          <img
            src={user.avatar}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover"
            loading="lazy"
            onError={(e) => (e.target.src = `https://ui-avatars.com/api/?name=${user.name[0]}`)}
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h4 className="font-semibold text-lg">{user.name}</h4>
              {type === 'learner' ? (
                <Badge variant="secondary" className="text-sm">
                  {user.level}
                </Badge>
              ) : (
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  <span className="text-sm font-medium">{user.rating}</span>
                </div>
              )}
              <span className="text-sm text-green-600 flex items-center gap-1">
                <FaChartLine /> {user.change}
              </span>
            </div>
            {type === 'creator' && <p className="text-sm text-gray-600">{user.specialty}</p>}
            <div className="flex flex-wrap gap-2">
              {user.badges.slice(0, 2).map((b) => (
                <Badge key={b} variant="outline" className="cursor-pointer text-xs" data-tooltip-id={`badge-${user.id}-${b}`}>
                  {b}
                  <Tooltip id={`badge-${user.id}-${b}`} content={b} place="top" />
                </Badge>
              ))}
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              {type === 'learner' ? (
                <>
                  <span>{user.sessionsAttended} sessions</span>
                  <span>{user.questionsAsked} questions</span>
                </>
              ) : (
                <>
                  <span>{user.totalSessions} sessions</span>
                  <span>{user.totalStudents} students</span>
                </>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">{type === 'learner' ? user.points.toLocaleString() : user.earnings}</div>
            <div className="text-sm text-gray-600">{type === 'learner' ? 'points' : 'earned'}</div>
          </div>
          <Tooltip id={`tooltip-${type}-${user.id}`} content={`${user.name}'s Profile`} place="top" />
        </div>
      </CardContent>
    </Card>
  )
}

const AchievementCard = ({ achievement }) => (
  <Card className="text-center hover:shadow-xl">
    <CardContent className="p-6">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${RARITY_COLORS[achievement.rarity].split(' ')[1]}`}>
        <achievement.icon className="text-white text-xl" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-2">
          <h4 className="font-semibold text-lg">{achievement.name}</h4>
          <Badge variant="secondary" className={`text-xs ${RARITY_COLORS[achievement.rarity]}`}>
            {achievement.rarity}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{achievement.description}</p>
        <p className="text-xs text-gray-600">{achievement.earnedBy} users earned</p>
      </div>
      <Tooltip id={`achievement-${achievement.id}`} content={achievement.description} place="top" />
    </CardContent>
  </Card>
)

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center gap-2 mt-6">
    <Button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      variant="outline"
      size="sm"
      aria-label="Previous page"
    >
      Prev
    </Button>
    {[...Array(totalPages)].map((_, i) => (
      <Button
        key={i}
        onClick={() => onPageChange(i + 1)}
        variant={currentPage === i + 1 ? 'default' : 'outline'}
        size="sm"
        aria-current={currentPage === i + 1 ? 'page' : undefined}
      >
        {i + 1}
      </Button>
    ))}
    <Button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      variant="outline"
      size="sm"
      aria-label="Next page"
    >
      Next
    </Button>
  </div>
)

const Leaderboards = () => {
  const { user } = useAuth()
  const [timePeriod, setTimePeriod] = useState('weekly')
  const [sortBy, setSortBy] = useState('points')
  const [viewMode, setViewMode] = useState('detailed') // detailed or compact
  const [topLearners, setTopLearners] = useState([])
  const [topCreators, setTopCreators] = useState([])
  const [achievements, setAchievements] = useState([])
  const [learnerRank, setLearnerRank] = useState(null)
  const [creatorRank, setCreatorRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('learners')
  const [searchQuery, setSearchQuery] = useState('')
  const [learnerPage, setLearnerPage] = useState(1)
  const [creatorPage, setCreatorPage] = useState(1)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const fetchData = async (retryCount = 0) => {
      setLoading(true)
      try {
        const [usersRes, leaderRes] = await Promise.all([
          fetch('http://localhost:3000/users'),
          fetch('http://localhost:3000/leaderboards'),
        ])

        if (!usersRes.ok || !leaderRes.ok) {
          throw new Error(usersRes.ok ? 'Leaderboard fetch failed' : 'Users fetch failed')
        }

        const users = await usersRes.json()
        const leader = await leaderRes.json()

        // Process users for learners and creators
        const sortedLearners = [...users]
          .sort((a, b) => b.achievements.points - a.achievements.points)
          .map((u, i) => ({
            id: u.id,
            rank: i + 1,
            name: u.username,
            avatar: u.profile.avatar,
            level: u.achievements.level,
            badges: u.achievements.badges,
            points: u.achievements.points,
            sessionsAttended: u.content.schedule.length,
            questionsAsked: u.performance.ratings.length,
            change: `+${Math.floor(Math.random() * 20)}%`,
          }))

        const sortedCreators = [...users]
          .filter(u => u.content.creations.length > 0)
          .sort((a, b) => b.performance.averageRating - a.performance.averageRating)
          .map((u, i) => ({
            id: u.id,
            rank: i + 1,
            name: u.username,
            avatar: u.profile.avatar,
            rating: u.performance.averageRating,
            totalSessions: u.content.schedule.length + u.content.creations.length,
            totalStudents: u.social.totalFollowers,
            specialty: u.content.creations[0]?.tags[1] || 'General',
            earnings: `$${Math.floor(u.performance.averageRating * 2000).toLocaleString()}`,
            badges: u.achievements.badges,
            change: `+${Math.floor(Math.random() * 15)}%`,
          }))

        setTopLearners(sortedLearners)
        setTopCreators(sortedCreators)
        setAchievements(leader.achievements.available.map(a => ({
          ...a,
          icon: a.icon === 'trophy' ? FaTrophy : FaAward,
        })))

        if (user && user.id) {
          setLearnerRank(sortedLearners.findIndex(u => u.id === user.id) + 1 || 'Unranked')
          setCreatorRank(sortedCreators.findIndex(u => u.id === user.id) + 1 || 'Unranked')
        }

        setLoading(false)
      } catch (err) {
        console.error('Error fetching data:', err)
        if (retryCount < 3) {
          setTimeout(() => fetchData(retryCount + 1), 1000 * Math.pow(2, retryCount))
        } else {
          setError('Unable to load leaderboard data after multiple attempts.')
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [user])

  // Memoized filtered data
  const filteredLearners = useMemo(() => {
    return topLearners.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [topLearners, searchQuery])

  const filteredCreators = useMemo(() => {
    return topCreators.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [topCreators, searchQuery])

  // Sorting and filtering logic
  const sortedLearners = useMemo(() => {
    const sorted = [...filteredLearners]
    switch (sortBy) {
      case 'sessions':
        return sorted.sort((a, b) => b.sessionsAttended - a.sessionsAttended)
      case 'questions':
        return sorted.sort((a, b) => b.questionsAsked - a.questionsAsked)
      case 'level':
        return sorted.sort((a, b) => {
          const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
          return levels.indexOf(b.level) - levels.indexOf(a.level)
        })
      default:
        return sorted.sort((a, b) => b.points - a.points)
    }
  }, [filteredLearners, sortBy])

  const sortedCreators = useMemo(() => {
    const sorted = [...filteredCreators]
    switch (sortBy) {
      case 'sessions':
        return sorted.sort((a, b) => b.totalSessions - a.totalSessions)
      case 'students':
        return sorted.sort((a, b) => b.totalStudents - a.totalStudents)
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating)
      default:
        return sorted.sort((a, b) => parseFloat(b.earnings.replace(/[$,]/g, '')) - parseFloat(a.earnings.replace(/[$,]/g, '')))
    }
  }, [filteredCreators, sortBy])

  // Pagination logic
  const learnerTotalPages = Math.ceil(sortedLearners.length / ITEMS_PER_PAGE)
  const creatorTotalPages = Math.ceil(sortedCreators.length / ITEMS_PER_PAGE)
  const paginatedLearners = sortedLearners.slice((learnerPage - 1) * ITEMS_PER_PAGE, learnerPage * ITEMS_PER_PAGE)
  const paginatedCreators = sortedCreators.slice((creatorPage - 1) * ITEMS_PER_PAGE, creatorPage * ITEMS_PER_PAGE)

  // Stats calculations
  const totalUsers = topLearners.length + topCreators.length
  const avgPoints = useMemo(() => {
    const total = topLearners.reduce((sum, user) => sum + user.points, 0)
    return Math.round(total / topLearners.length) || 0
  }, [topLearners])

  const topPerformer = useMemo(() => {
    return topLearners[0]?.points > parseFloat(topCreators[0]?.earnings.replace(/[$,]/g, '') || 0)
      ? topLearners[0]
      : topCreators[0]
  }, [topLearners, topCreators])

  // Helper functions
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Gamify Leaderboards',
        text: `Check out the latest rankings! I'm currently ranked #${learnerRank} as a learner.`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const handleExport = () => {
    const data = activeTab === 'learners' ? sortedLearners : sortedCreators
    const csv = [
      ['Rank', 'Name', 'Points/Earnings', 'Level/Rating', 'Sessions', 'Badge Count'].join(','),
      ...data.map(user => [
        user.rank,
        user.name,
        activeTab === 'learners' ? user.points : user.earnings,
        activeTab === 'learners' ? user.level : user.rating,
        activeTab === 'learners' ? user.sessionsAttended : user.totalSessions,
        user.badges.length
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTab}-${timePeriod}-leaderboard.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <FaTrophy className="text-gray-400 text-6xl mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Leaderboards</h2>
            <p className="text-gray-600 mb-6">Fetching the latest rankings...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <FaTrophy className="text-red-400 text-6xl mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <FaTrophy className="text-gray-600 text-xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Leaderboards</h1>
              <p className="text-gray-600">Discover top performers and track your progress within the community</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Ranking */}
      {user && (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Card className="border-l-4 border-l-gray-800">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-20 h-20 rounded-full border-2 object-cover"
                    loading="lazy"
                    onError={(e) => (e.target.src = `https://ui-avatars.com/api/?name=${user.name?.[0] || ''}`)}
                  />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Your Current Rank</h3>
                    <p className="text-gray-600">
                      Learner: #{learnerRank} • Creator: #{creatorRank} • {user.points?.toLocaleString() || 0} points • {user.level || 'Beginner'}
                    </p>
                    <div className="flex items-center gap-3">
                      {user.badges?.[0] && (
                        <Badge variant="secondary" className="cursor-pointer" data-tooltip-id={`user-badge-${user.id}`}>
                          {user.badges[0]}
                          <Tooltip id={`user-badge-${user.id}`} content={user.badges[0]} place="top" />
                        </Badge>
                      )}
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <FaChartLine /> +15% this week
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <div className="text-sm text-gray-600 mb-2">Progress to Next Rank</div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-gray-800 h-4 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">750/1000 points</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Overview */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                <FaTrophy className="text-green-600 text-xl" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{avgPoints.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Avg Points</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
                <FaLongArrowAltUp className="text-purple-600 text-xl" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{topPerformer?.name || 'N/A'}</div>
              <div className="text-sm text-gray-600">Top Performer</div>
            </CardContent>
          </Card>
          <Card className="text-center border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-3">
                <FaClock className="text-orange-600 text-xl" />
              </div>
              <div className="text-sm font-bold text-gray-900">Live</div>
              <div className="text-xs text-gray-600">Updates every 30s</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rankings Header */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Rankings</h2>
            <p className="text-gray-600">Explore the top performers in our community</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 w-48"
                aria-label="Search users by username"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-gray-500"
              aria-label="Sort leaderboard by"
            >
              <option value="points">Points/Earnings</option>
              <option value="sessions">Sessions</option>
              <option value="questions">Questions</option>
              <option value="level">Level</option>
              <option value="rating">Rating</option>
              <option value="students">Students</option>
            </select>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-gray-500"
              aria-label="Select time period for rankings"
            >
              {TIME_PERIODS.map((v) => (
                <option key={v} value={v}>
                  {v === 'alltime' ? 'All Time' : `This ${v.charAt(0).toUpperCase() + v.slice(1)}`}
                </option>
              ))}
            </select>
            <div className="flex border rounded-md">
              <Button
                onClick={() => setViewMode('detailed')}
                variant={viewMode === 'detailed' ? 'default' : 'outline'}
                size="sm"
                aria-label="Detailed view"
              >
                <FaEye />
              </Button>
              <Button
                onClick={() => setViewMode('compact')}
                variant={viewMode === 'compact' ? 'default' : 'outline'}
                size="sm"
                aria-label="Compact view"
              >
                <FaSort />
              </Button>
            </div>
            <Button onClick={handleShare} variant="outline" size="sm">
              <FaShare className="mr-2" />
              Share
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm">
              <FaDownload className="mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 pb-8 max-w-7xl">
        <div className="space-y-8">
          <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-lg" role="tablist" aria-label="Leaderboard tabs">
            <Button
              onClick={() => setActiveTab('learners')}
              variant={activeTab === 'learners' ? 'default' : 'outline'}
              className="rounded-md"
              role="tab"
              aria-selected={activeTab === 'learners'}
              aria-controls="learners-panel"
              id="learners-tab"
            >
              Top Learners
            </Button>
            <Button
              onClick={() => setActiveTab('creators')}
              variant={activeTab === 'creators' ? 'default' : 'outline'}
              className="rounded-md"
              role="tab"
              aria-selected={activeTab === 'creators'}
              aria-controls="creators-panel"
              id="creators-tab"
            >
              Top Creators
            </Button>
            <Button
              onClick={() => setActiveTab('achievements')}
              variant={activeTab === 'achievements' ? 'default' : 'outline'}
              className="rounded-md"
              role="tab"
              aria-selected={activeTab === 'achievements'}
              aria-controls="achievements-panel"
              id="achievements-tab"
            >
              Achievements
            </Button>
          </div>

          {/* Learners Tab */}
          {activeTab === 'learners' && (
            <div id="learners-panel" role="tabpanel" aria-labelledby="learners-tab">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-2xl font-semibold">
                  <FaTrophy className="text-yellow-500" /> Top Learners
                </div>
                <div className="space-y-6">
                  {paginatedLearners.length ? (
                    paginatedLearners.map((learner, i) => (
                      <UserCard key={learner.id} user={learner} type="learner" index={i} viewMode={viewMode} />
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <FaSearch className="text-gray-400 text-4xl mx-auto mb-4" />
                        <p className="text-gray-600">No learners match your search.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
                <Pagination
                  currentPage={learnerPage}
                  totalPages={learnerTotalPages}
                  onPageChange={setLearnerPage}
                />
              </div>
            </div>
          )}

          {/* Creators Tab */}
          {activeTab === 'creators' && (
            <div id="creators-panel" role="tabpanel" aria-labelledby="creators-tab">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-2xl font-semibold">
                  <FaStar className="text-yellow-500" /> Top Creators
                </div>
                <div className="space-y-6">
                  {paginatedCreators.length ? (
                    paginatedCreators.map((creator, i) => (
                      <UserCard key={creator.id} user={creator} type="creator" index={i} viewMode={viewMode} />
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <FaSearch className="text-gray-400 text-4xl mx-auto mb-4" />
                        <p className="text-gray-600">No creators match your search.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
                <Pagination
                  currentPage={creatorPage}
                  totalPages={creatorTotalPages}
                  onPageChange={setCreatorPage}
                />
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div id="achievements-panel" role="tabpanel" aria-labelledby="achievements-tab">
              <div className="space-y-8">
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 text-2xl font-semibold mb-4">
                      <FaBullseye className="text-purple-600" /> Weekly Challenge
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold">Knowledge Explorer Challenge</h3>
                        <p className="text-gray-600">Attend sessions in 3 different categories this week</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>2/3 Categories</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div className="bg-purple-600 h-4 rounded-full" style={{ width: '66%' }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-600">500 bonus points + Explorer badge</p>
                          <p className="text-sm text-gray-600">3 days left • 1,247 participating</p>
                        </div>
                        <Button size="lg">
                          View Sessions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-2xl font-semibold">
                    <FaAward className="text-yellow-500" /> Achievement Gallery
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((a) => (
                      <AchievementCard key={a.id} achievement={a} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    rank: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    level: PropTypes.string,
    rating: PropTypes.number,
    badges: PropTypes.arrayOf(PropTypes.string).isRequired,
    points: PropTypes.number,
    sessionsAttended: PropTypes.number,
    questionsAsked: PropTypes.number,
    totalSessions: PropTypes.number,
    totalStudents: PropTypes.number,
    specialty: PropTypes.string,
    earnings: PropTypes.string,
    change: PropTypes.string.isRequired,
  }).isRequired,
  type: PropTypes.oneOf(['learner', 'creator']).isRequired,
  index: PropTypes.number.isRequired,
}

AchievementCard.propTypes = {
  achievement: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    rarity: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    earnedBy: PropTypes.number.isRequired,
  }).isRequired,
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default Leaderboards
