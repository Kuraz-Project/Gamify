import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../App'
import { FaVideo, FaCalendarAlt, FaUsers, FaStar, FaClock, FaPlay, FaEye, FaSearch, FaFilter } from 'react-icons/fa'
import { Tooltip } from 'react-tooltip'
import PropTypes from 'prop-types'

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

const SessionCard = ({ session, type }) => (
    <Card className="hover:shadow-md">
        <CardContent className="p-6">
        <div className="flex items-start gap-4">
            <img
            src={session.thumbnail || 'https://via.placeholder.com/150'}
            alt={session.title}
            className="w-20 h-20 rounded-lg object-cover"
            loading="lazy"
            />
            <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
                <div>
                <h4 className="font-semibold text-lg">{session.title}</h4>
                <p className="text-sm text-gray-600">{session.description}</p>
                </div>
                <Badge variant={session.status === 'live' ? 'default' : 'secondary'}>
                {session.status}
                </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                <FaCalendarAlt /> {new Date(session.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                <FaClock /> {session.duration} min
                </span>
                {type === 'creator' && (
                <span className="flex items-center gap-1">
                    <FaUsers /> {session.attendees} attendees
                </span>
                )}
                {type === 'learner' && (
                <span className="flex items-center gap-1">
                    <FaStar /> {session.rating}/5
                </span>
                )}
            </div>
            <div className="flex items-center gap-2">
                {session.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                </Badge>
                ))}
            </div>
            </div>
            <div className="flex flex-col gap-2">
            <Button size="sm" variant="outline">
                <FaEye className="mr-1" /> View
            </Button>
            {session.status === 'upcoming' && (
                <Button size="sm">
                <FaPlay className="mr-1" /> Join
                </Button>
            )}
            </div>
        </div>
        </CardContent>
    </Card>
)

const MySessions = () => {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('learner')
    const [sessions, setSessions] = useState({ learner: [], creator: [] })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true)
      try {
        if (!user || !user.id) {
          throw new Error('User not logged in')
        }

        // Fetch user data which contains session information
        const userRes = await fetch(`http://localhost:3000/users/${user.id}`)

        if (!userRes.ok) {
          throw new Error(`Failed to fetch user sessions: ${userRes.status}`)
        }

        const userData = await userRes.json()

        // Extract sessions from user data
        const learnerSessions = userData.sessions?.learner || []
        const creatorSessions = userData.sessions?.creator || []

        setSessions({ learner: learnerSessions, creator: creatorSessions })
        setLoading(false)
      } catch (err) {
        console.error('Error fetching sessions:', err)
        setError(`Unable to load sessions: ${err.message}`)
        setLoading(false)
      }
    }

    if (user && user.id) {
      fetchSessions()
    } else {
      setLoading(false)
      setError('Please log in to view your sessions.')
    }
  }, [user])

  const filteredSessions = useMemo(() => {
    const currentSessions = sessions[activeTab]
    return currentSessions.filter(session => {
      const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterStatus === 'all' || session.status === filterStatus
      return matchesSearch && matchesFilter
    })
  }, [sessions, activeTab, searchQuery, filterStatus])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <FaVideo className="text-gray-400 text-6xl mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Sessions</h2>
            <p className="text-gray-600 mb-6">Fetching your sessions...</p>
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
            <FaVideo className="text-red-400 text-6xl mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Sessions</h2>
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
              <FaVideo className="text-gray-600 text-xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Sessions</h1>
              <p className="text-gray-600">Manage your attended and created sessions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 w-full"
              aria-label="Search sessions"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-gray-500 outline-none"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg mb-6" role="tablist" aria-label="Session tabs">
          <Button
            onClick={() => setActiveTab('learner')}
            variant={activeTab === 'learner' ? 'default' : 'outline'}
            className="rounded-md"
            role="tab"
            aria-selected={activeTab === 'learner'}
            aria-controls="learner-panel"
            id="learner-tab"
          >
            As Learner ({sessions.learner.length})
          </Button>
          <Button
            onClick={() => setActiveTab('creator')}
            variant={activeTab === 'creator' ? 'default' : 'outline'}
            className="rounded-md"
            role="tab"
            aria-selected={activeTab === 'creator'}
            aria-controls="creator-panel"
            id="creator-tab"
          >
            As Creator ({sessions.creator.length})
          </Button>
        </div>

        {/* Sessions List */}
        <div className="space-y-6">
          {filteredSessions.length ? (
            filteredSessions.map(session => (
              <SessionCard key={session.id} session={session} type={activeTab} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FaSearch className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-600">No sessions match your criteria.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

SessionCard.propTypes = {
  session: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    date: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    status: PropTypes.oneOf(['upcoming', 'live', 'completed']).isRequired,
    attendees: PropTypes.number,
    rating: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  type: PropTypes.oneOf(['learner', 'creator']).isRequired,
}

export default MySessions
