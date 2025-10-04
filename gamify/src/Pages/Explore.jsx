import React, { useState, useEffect } from 'react';
import { Search, Calendar, Users, Star, Play, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';

const categories = ['All', 'Technology', 'Business', 'Creative', 'Finance', 'Marketing', 'Health'];
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = ['Most Popular', 'Newest', 'Price: Low to High', 'Price: High to Low'];

const Explore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All Levels');
  const [sortOption, setSortOption] = useState('Most Popular');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveSessions, setLiveSessions] = useState([]);
  const [myBookedSessions, setMyBookedSessions] = useState([]);
  const [myLiveSessions, setMyLiveSessions] = useState([]);
  const [showMySessions, setShowMySessions] = useState(false); // Start collapsed
  const [showLiveSessions, setShowLiveSessions] = useState(false); // Hidden until button clicked
  const today = new Date('2025-10-04T14:24:00Z'); // 06:24 PM +04

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sessionsResponse, liveSessionsResponse] = await Promise.all([
          fetch('http://localhost:3000/sessions'),
          fetch('http://localhost:3000/liveSessions'),
        ]);
        if (!sessionsResponse.ok || !liveSessionsResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        const sessionsData = await sessionsResponse.json();
        const liveSessionsData = await liveSessionsResponse.json();

        setSessions(sessionsData);
        setFilteredSessions(sessionsData);

        // Simulate a live session using an existing session (e.g., ID "6" - React Performance Optimization)
        const simulateLiveSession = sessionsData.find(s => s.id === "6"); // Use ID "6" as an example
        if (simulateLiveSession) {
          const start = new Date('2025-10-04T13:30:00Z'); // 05:30 PM +04
          const duration = 90; // 90 minutes (override duration)
          const end = new Date(start.getTime() + duration * 60000);
          if (start <= today && today <= end) {
            setLiveSessions([{ 
              ...simulateLiveSession, 
              isLive: true, 
              viewers: 750,
              startTime: start,
              duration: duration
            }]);
          }
        }

        // Fallback to check liveSessions data if simulation fails
        if (liveSessionsData.currentSession && liveSessionsData.currentSession.status?.isLive) {
          const liveSessionMatch = sessionsData.find(s => s.title === liveSessionsData.currentSession.title);
          if (liveSessionMatch) {
            const start = new Date(liveSessionsData.currentSession.status.startTime);
            const duration = parseDuration(liveSessionsData.currentSession.status.duration);
            const end = new Date(start.getTime() + duration * 60000);
            if (start <= today && today <= end) {
              setLiveSessions([{ 
                ...liveSessionMatch, 
                isLive: true, 
                viewers: liveSessionsData.currentSession.status.viewers,
                startTime: start,
                duration: duration
              }]);
            }
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load sessions. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user && sessions.length > 0) {
      const fetchMyBooked = async () => {
        try {
          const bookingsResponse = await fetch(`http://localhost:3000/bookings?userId=${user.id || 1}`);
          if (!bookingsResponse.ok) throw new Error('Failed to fetch bookings');
          const bookingsData = await bookingsResponse.json();
          const bookedSessionIds = bookingsData.map(b => b.sessionId);
          const bookedSessions = sessions.filter(s => bookedSessionIds.includes(s.id));
          setMyBookedSessions(bookedSessions);
          const myLive = bookedSessions.filter(session => liveSessions.some(ls => ls.id === session.id));
          setMyLiveSessions(myLive);
        } catch (err) {
          console.error('Failed to load your booked sessions:', err);
          setError('Failed to load your booked sessions.');
        }
      };
      fetchMyBooked();
    }
  }, [user, sessions, liveSessions]);

  useEffect(() => {
    let result = [...sessions];
    if (searchQuery) {
      result = result.filter(
        (session) =>
          session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (categoryFilter !== 'All') {
      result = result.filter((session) => session.category === categoryFilter);
    }
    if (levelFilter !== 'All Levels') {
      result = result.filter((session) => session.level === levelFilter);
    }
    switch (sortOption) {
      case 'Most Popular':
        result.sort((a, b) => b.participants - a.participants);
        break;
      case 'Newest':
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'Price: Low to High':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setFilteredSessions(result);
  }, [searchQuery, categoryFilter, levelFilter, sortOption, sessions]);

  const parseDuration = (durationStr) => {
    const [minutes, seconds] = durationStr.split(':').map(Number);
    return minutes + (seconds || 0) / 60;
  };

  const isSessionLive = (session) => {
    return liveSessions.some(ls => ls.id === session.id);
  };

  const handleJoinOrBook = async (session) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isSessionLive(session)) {
      alert(`Joining live session: ${session.title}`);
    } else if ((session.participants || 0) < (session.maxParticipants || 10)) {
      try {
        const newBooking = {
          id: Date.now(),
          userId: user.id || 1,
          sessionId: session.id,
          bookedAt: new Date().toISOString(),
          status: 'confirmed',
        };
        const response = await fetch('http://localhost:3000/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBooking),
        });
        if (!response.ok) throw new Error('Failed to book session');
        setSessions(prevSessions =>
          prevSessions.map(s =>
            s.id === session.id ? { ...s, participants: (s.participants || 0) + 1 } : s
          )
        );
        alert(`Successfully booked session: ${session.title}`);
      } catch (err) {
        console.error('Error booking session:', err);
        setError('Failed to book session. Please try again.');
      }
    } else {
      alert(`Joining waitlist for: ${session.title} (Waitlist: ${(session.waitlistCount || 0) + 1})`);
      setSessions(prevSessions =>
        prevSessions.map(s =>
          s.id === session.id ? { ...s, waitlistCount: (s.waitlistCount || 0) + 1 } : s
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="space-y-4">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-4">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loading && user) return <div className="text-center py-16">Loading your booked sessions...</div>;
  if (error) return <div className="text-center py-16 text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Explore Sessions</h1>
        <p className="text-gray-600">Discover live Q&A sessions with experts</p>
      </div>
      {user && (
        <div className="space-y-4">
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
                      {liveSessions.length} Live Session{liveSessions.length > 1 ? 's' : ''} Now
                    </h3>
                    <p className="text-gray-600">Join ongoing Q&A sessions with experts</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLiveSessions(!showLiveSessions)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {showLiveSessions ? 'Hide Live Sessions' : 'View Live Sessions'}
                </button>
              </div>
              {showLiveSessions && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveSessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Live</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{session.category}</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">{session.level}</span>
                      </div>
                      <h4 className="font-semibold">{session.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{session.creator} • {session.viewers} viewers</p>
                      <button onClick={() => handleJoinOrBook(session)} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        Join Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My Booked Sessions</h2>
              <button onClick={() => setShowMySessions(!showMySessions)} className="text-gray-600 hover:text-gray-800">
                {showMySessions ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </div>
            {showMySessions && (
              <>
                {myLiveSessions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Live Now ({myLiveSessions.length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                      {myLiveSessions.map((session) => (
                        <div key={session.id} className="border rounded-lg p-4 bg-white shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Live Now</span>
                            <h4 className="font-semibold">{session.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{session.creator} • {new Date(session.date).toLocaleDateString()}</p>
                          <button onClick={() => handleJoinOrBook(session)} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                            Join Now
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {myBookedSessions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                    {myBookedSessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4 bg-white shadow-sm">
                        <h4 className="font-semibold mb-2">{session.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{session.creator} • {new Date(session.date).toLocaleDateString()}</p>
                        <button onClick={() => handleJoinOrBook(session)} className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300">
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg">
                    <p className="text-gray-600 mb-2">No booked sessions yet.</p>
                    <p className="text-sm text-blue-600">Explore and book sessions below to get started!</p>
                  </div>
                )}
                <div className="mt-4 text-right">
                  <button className="text-blue-600 hover:underline">View All My Bookings</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search sessions, creators, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-40 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-600"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="w-full sm:w-40 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-600"
        >
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full sm:w-40 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-600"
        >
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} found
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session) => (
          <div key={session.id} className="group rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 bg-white">
            <div className="relative h-48 overflow-hidden">
              <img
                src={session.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={session.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              {session.trending && (
                <span className="absolute top-2 left-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-600 text-white">
                  Trending
                </span>
              )}
              {isSessionLive(session) && (
                <span className="absolute top-2 right-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                  <Play className="mr-1 h-3 w-3" /> Live
                </span>
              )}
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {session.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={session.avatar || `https://ui-avatars.com/api/?name=${session.creator[0]}`}
                      alt={session.creator}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600">{session.creator}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{session.description}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{isSessionLive(session) ? 'Live Now' : new Date(session.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{session.duration || '60 mins'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{session.participants || 0}/{session.maxParticipants || 10}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{session.rating || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800">
                      {session.level || 'All Levels'}
                    </span>
                    <span className="text-sm font-medium text-gray-800">${session.price || 0}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleJoinOrBook(session)}
                  disabled={!isSessionLive(session) && (session.participants || 0) >= (session.maxParticipants || 10)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    isSessionLive(session)
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : (session.participants || 0) >= (session.maxParticipants || 10)
                      ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                      : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {isSessionLive(session) ? (
                    <>
                      <Play className="h-4 w-4 fill-current" />
                      Join Live Session
                    </>
                  ) : (session.participants || 0) >= (session.maxParticipants || 10) ? (
                    'Join Waitlist'
                  ) : (
                    'Book Session'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
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
  );
};

export default Explore;