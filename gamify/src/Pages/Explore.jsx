import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaCalendar, FaUsers, FaStar, FaPlay, FaClock, FaFire, FaBook, FaUser } from 'react-icons/fa';

const categories = ['All', 'Technology', 'Business', 'Creative', 'Finance', 'Marketing', 'Health'];
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = ['Most Popular', 'Newest', 'Price: Low to High', 'Price: High to Low'];

const Explore = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All Levels');
  const [sortOption, setSortOption] = useState('Most Popular');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/sessions');
        if (!response.ok) {
          throw new Error('Failed to fetch sessions');
        }
        const data = await response.json();
        setSessions(data);
        setFilteredSessions(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Failed to load sessions. Please try again.');
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    let result = [...sessions];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (session) =>
          session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'All') {
      result = result.filter((session) => session.category === categoryFilter);
    }

    // Level filter
    if (levelFilter !== 'All Levels') {
      result = result.filter((session) => session.level === levelFilter);
    }

    // Sorting
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
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold text-gray-800">{error}</h1>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Explore Sessions</h1>
        <p className="text-lg text-gray-600">Discover and join live or upcoming sessions from top creators</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search sessions, creators, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className="border bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className="relative">
              <img
                src={session.image}
                alt={session.title}
                className="w-full h-48 object-cover"
                onError={(e) => (e.target.src = 'https://images.unsplash.com/photo-1587279825909-6725a8a82e4e?q=80&w=1080&auto=format&fit=crop')}
              />
              {session.trending && (
                <span className="absolute top-2 left-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                  <FaFire className="mr-1 h-3 w-3" /> Trending
                </span>
              )}
              {session.live && (
                <span className="absolute top-2 right-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                  <FaPlay className="mr-1 h-3 w-3" /> Live
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
                      src={session.avatar}
                      alt={session.creator}
                      className="w-6 h-6 rounded-full object-cover"
                      onError={(e) => (e.target.src = `https://ui-avatars.com/api/?name=${session.creator[0]}`)}
                    />
                    <span className="text-sm text-gray-600">{session.creator}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{session.description}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <FaCalendar className="h-4 w-4" />
                      <span>{session.live ? 'Live Now' : session.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <FaClock className="h-4 w-4" />
                      <span>{session.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <FaUsers className="h-4 w-4" />
                      <span>{session.participants}/{session.maxParticipants}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaStar className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{session.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800">
                      {session.level}
                    </span>
                    <span className="text-sm font-medium text-gray-800">${session.price}</span>
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
                      <FaPlay className="h-4 w-4 fill-current" />
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
            <FaSearch className="text-gray-500 h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No sessions found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

export default Explore;