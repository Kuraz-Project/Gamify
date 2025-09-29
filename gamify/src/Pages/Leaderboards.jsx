import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../App';
import { FaTrophy, FaMedal, FaCrown, FaChartLine, FaStar, FaAward, FaBullseye, FaSearch, FaSort, FaShare, FaDownload, FaEye, FaUsers, FaClock,  } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { FaLongArrowAltUp } from 'react-icons/fa';
import PropTypes from 'prop-types';

// Constants
const TIME_PERIODS = ['weekly', 'monthly', 'quarterly', 'alltime'];
const RARITY_COLORS = {
  Legendary: 'text-yellow-600 bg-yellow-500',
  Epic: 'text-purple-600 bg-purple-500',
  Rare: 'text-blue-600 bg-blue-500',
  Common: 'text-gray-600 bg-gray-500',
};
const ITEMS_PER_PAGE = 5;

// Rank icon helper
const rankIcon = (rank) => {
  if (rank === 1) return <FaCrown className="text-yellow-500 text-3xl" />;
  if (rank === 2) return <FaMedal className="text-gray-400 text-3xl" />;
  if (rank === 3) return <FaMedal className="text-amber-600 text-3xl" />;
  return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
};

// Sub-components
const UserCard = ({ user, type, index, viewMode = 'detailed' }) => {
  if (viewMode === 'compact') {
    return (
      <div
        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
        data-tooltip-id={`tooltip-${type}-${user.id}`}
      >
        <div className="flex items-center justify-center w-10 h-10">{rankIcon(user.rank)}</div>
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
          loading="lazy"
          onError={(e) => (e.target.src = `https://ui-avatars.com/api/?name=${user.name[0]}`)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-base truncate">{user.name}</h4>
            {type === 'learner' ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                {user.level}
              </span>
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
    );
  }

  return (
    <div
      className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
      data-tooltip-id={`tooltip-${type}-${user.id}`}
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
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              {user.level}
            </span>
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
            <span
              key={b}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800 cursor-pointer"
              data-tooltip-id={`badge-${user.id}-${b}`}
            >
              {b}
              <Tooltip id={`badge-${user.id}-${b}`} content={b} place="top" />
            </span>
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
  );
};

const AchievementCard = ({ achievement }) => (
  <div
    className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
    data-tooltip-id={`achievement-${achievement.id}`}
  >
    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${RARITY_COLORS[achievement.rarity].split(' ')[1]}`}>
      <achievement.icon className="text-white text-xl" />
    </div>
    <div className="flex-1 space-y-1">
      <div className="flex items-center gap-2">
        <h4 className="font-semibold text-lg">{achievement.name}</h4>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${RARITY_COLORS[achievement.rarity]} bg-gray-200`}>
          {achievement.rarity}
        </span>
      </div>
      <p className="text-sm text-gray-600">{achievement.description}</p>
      <p className="text-xs text-gray-600">{achievement.earnedBy} users earned</p>
    </div>
    <Tooltip id={`achievement-${achievement.id}`} content={achievement.description} place="top" />
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center gap-2 mt-6">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300"
      aria-label="Previous page"
    >
      Prev
    </button>
    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        onClick={() => onPageChange(i + 1)}
        className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        aria-current={currentPage === i + 1 ? 'page' : undefined}
      >
        {i + 1}
      </button>
    ))}
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300"
      aria-label="Next page"
    >
      Next
    </button>
  </div>
);

const Leaderboards = () => {
  const { user } = useAuth();
  const [timePeriod, setTimePeriod] = useState('weekly');
  const [sortBy, setSortBy] = useState('points');
  const [viewMode, setViewMode] = useState('detailed'); // detailed or compact
  const [topLearners, setTopLearners] = useState([]);
  const [topCreators, setTopCreators] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [learnerRank, setLearnerRank] = useState(null);
  const [creatorRank, setCreatorRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('learners');
  const [searchQuery, setSearchQuery] = useState('');
  const [learnerPage, setLearnerPage] = useState(1);
  const [creatorPage, setCreatorPage] = useState(1);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchData = async (retryCount = 0) => {
      setLoading(true);
      try {
        const [usersRes, leaderRes] = await Promise.all([
          fetch('http://localhost:3000/users'),
          fetch('http://localhost:3000/leaderboards'),
        ]);

        if (!usersRes.ok || !leaderRes.ok) {
          throw new Error(usersRes.ok ? 'Leaderboard fetch failed' : 'Users fetch failed');
        }

        const users = await usersRes.json();
        const leader = await leaderRes.json();

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
          }));

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
          }));

        setTopLearners(sortedLearners);
        setTopCreators(sortedCreators);
        setAchievements(leader.achievements.available.map(a => ({
          ...a,
          icon: a.icon === 'trophy' ? FaTrophy : FaAward,
        })));

        if (user && user.id) {
          setLearnerRank(sortedLearners.findIndex(u => u.id === user.id) + 1 || 'Unranked');
          setCreatorRank(sortedCreators.findIndex(u => u.id === user.id) + 1 || 'Unranked');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        if (retryCount < 3) {
          setTimeout(() => fetchData(retryCount + 1), 1000 * Math.pow(2, retryCount));
        } else {
          setError('Unable to load leaderboard data after multiple attempts.');
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  // Memoized filtered data
  const filteredLearners = useMemo(() => {
    return topLearners.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [topLearners, searchQuery]);

  const filteredCreators = useMemo(() => {
    return topCreators.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [topCreators, searchQuery]);

  // Sorting and filtering logic
  const sortedLearners = useMemo(() => {
    const sorted = [...filteredLearners];
    switch (sortBy) {
      case 'sessions':
        return sorted.sort((a, b) => b.sessionsAttended - a.sessionsAttended);
      case 'questions':
        return sorted.sort((a, b) => b.questionsAsked - a.questionsAsked);
      case 'level':
        return sorted.sort((a, b) => {
          const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
          return levels.indexOf(b.level) - levels.indexOf(a.level);
        });
      default:
        return sorted.sort((a, b) => b.points - a.points);
    }
  }, [filteredLearners, sortBy]);

  const sortedCreators = useMemo(() => {
    const sorted = [...filteredCreators];
    switch (sortBy) {
      case 'sessions':
        return sorted.sort((a, b) => b.totalSessions - a.totalSessions);
      case 'students':
        return sorted.sort((a, b) => b.totalStudents - a.totalStudents);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted.sort((a, b) => parseFloat(b.earnings.replace(/[$,]/g, '')) - parseFloat(a.earnings.replace(/[$,]/g, '')));
    }
  }, [filteredCreators, sortBy]);

  // Pagination logic
  const learnerTotalPages = Math.ceil(sortedLearners.length / ITEMS_PER_PAGE);
  const creatorTotalPages = Math.ceil(sortedCreators.length / ITEMS_PER_PAGE);
  const paginatedLearners = sortedLearners.slice((learnerPage - 1) * ITEMS_PER_PAGE, learnerPage * ITEMS_PER_PAGE);
  const paginatedCreators = sortedCreators.slice((creatorPage - 1) * ITEMS_PER_PAGE, creatorPage * ITEMS_PER_PAGE);

  // Stats calculations
  const totalUsers = topLearners.length + topCreators.length;
  const avgPoints = useMemo(() => {
    const total = topLearners.reduce((sum, user) => sum + user.points, 0);
    return Math.round(total / topLearners.length) || 0;
  }, [topLearners]);

  const topPerformer = useMemo(() => {
    return topLearners[0]?.points > parseFloat(topCreators[0]?.earnings.replace(/[$,]/g, '') || 0)
      ? topLearners[0]
      : topCreators[0];
  }, [topLearners, topCreators]);

  // Helper functions
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Gamify Leaderboards',
        text: `Check out the latest rankings! I'm currently ranked #${learnerRank} as a learner.`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  const handleExport = () => {
    const data = activeTab === 'learners' ? sortedLearners : sortedCreators;
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
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-${timePeriod}-leaderboard.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="space-y-4">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-6">
          <div className="border bg-white rounded-lg shadow-sm p-8">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
            {[...Array(5)].map((_, j) => (
              <div key={j} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gray-200 animate-pulse" />
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
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
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          aria-label="Retry loading leaderboards"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Leaderboards</h1>
        <p className="text-lg text-gray-600">Discover top performers and track your progress within the community</p>
      </div>

      {/* User Ranking */}
      {user && (
        <div className="border bg-white rounded-lg shadow-sm p-8">
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
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 cursor-pointer"
                      data-tooltip-id={`user-badge-${user.id}`}
                    >
                      {user.badges[0]}
                      <Tooltip id={`user-badge-${user.id}`} content={user.badges[0]} place="top" />
                    </span>
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
                <div className="bg-blue-600 h-4 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="text-sm text-gray-600 mt-2">750/1000 points</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border rounded-lg p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
            <FaUsers className="text-blue-600 text-xl" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{totalUsers.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        <div className="bg-white border rounded-lg p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
            <FaTrophy className="text-green-600 text-xl" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{avgPoints.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Avg Points</div>
        </div>
        <div className="bg-white border rounded-lg p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
            <FaLongArrowAltUp className="text-purple-600 text-xl" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{topPerformer?.name || 'N/A'}</div>
          <div className="text-sm text-gray-600">Top Performer</div>
        </div>
        <div className="bg-white border rounded-lg p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-3">
            <FaClock className="text-orange-600 text-xl" />
          </div>
          <div className="text-sm font-bold text-gray-800">Live</div>
          <div className="text-xs text-gray-600">Updates every 30s</div>
        </div>
      </div>

      {/* Rankings Header */}
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
              className="pl-10 pr-4 py-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 w-48"
              aria-label="Search users by username"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-600"
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
            className="border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-600"
            aria-label="Select time period for rankings"
          >
            {TIME_PERIODS.map((v) => (
              <option key={v} value={v}>
                {v === 'alltime' ? 'All Time' : `This ${v.charAt(0).toUpperCase() + v.slice(1)}`}
              </option>
            ))}
          </select>
          <div className="flex border rounded-md">
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-2 ${viewMode === 'detailed' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'} rounded-l-md`}
              aria-label="Detailed view"
            >
              <FaEye />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-3 py-2 ${viewMode === 'compact' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'} rounded-r-md`}
              aria-label="Compact view"
            >
              <FaSort />
            </button>
          </div>
          <button
            onClick={handleShare}
            className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            aria-label="Share leaderboard"
          >
            <FaShare className="mr-2" />
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            aria-label="Export leaderboard data"
          >
            <FaDownload className="mr-2" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-lg" role="tablist" aria-label="Leaderboard tabs">
          <button
            onClick={() => setActiveTab('learners')}
            className={`text-lg py-3 rounded-md font-medium ${activeTab === 'learners' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
            role="tab"
            aria-selected={activeTab === 'learners'}
            aria-controls="learners-panel"
            id="learners-tab"
          >
            Top Learners
          </button>
          <button
            onClick={() => setActiveTab('creators')}
            className={`text-lg py-3 rounded-md font-medium ${activeTab === 'creators' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
            role="tab"
            aria-selected={activeTab === 'creators'}
            aria-controls="creators-panel"
            id="creators-tab"
          >
            Top Creators
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`text-lg py-3 rounded-md font-medium ${activeTab === 'achievements' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
            role="tab"
            aria-selected={activeTab === 'achievements'}
            aria-controls="achievements-panel"
            id="achievements-tab"
          >
            Achievements
          </button>
        </div>

        {/* Learners Tab */}
        {activeTab === 'learners' && (
          <div id="learners-panel" role="tabpanel" aria-labelledby="learners-tab">
            <div className="border bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-3 text-2xl font-semibold mb-4">
                <FaTrophy className="text-yellow-500" /> Top Learners
              </div>
              <div className="space-y-6">
                {paginatedLearners.length ? (
                  paginatedLearners.map((learner, i) => (
                    <UserCard key={learner.id} user={learner} type="learner" index={i} viewMode={viewMode} />
                  ))
                ) : (
                  <p className="text-gray-600">No learners match your search.</p>
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
            <div className="border bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-3 text-2xl font-semibold mb-4">
                <FaStar className="text-yellow-500" /> Top Creators
              </div>
              <div className="space-y-6">
                {paginatedCreators.length ? (
                  paginatedCreators.map((creator, i) => (
                    <UserCard key={creator.id} user={creator} type="creator" index={i} viewMode={viewMode} />
                  ))
                ) : (
                  <p className="text-gray-600">No creators match your search.</p>
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
              <div className="border bg-white rounded-lg shadow-sm p-8">
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
                      <div className="bg-blue-600 h-4 rounded-full" style={{ width: '66%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-600">500 bonus points + Explorer badge</p>
                      <p className="text-sm text-gray-600">3 days left • 1,247 participating</p>
                    </div>
                    <button
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      aria-label="View sessions for challenge"
                    >
                      View Sessions
                    </button>
                  </div>
                </div>
              </div>

              <div className="border bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center gap-3 text-2xl font-semibold mb-4">
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
  );
};

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
};

AchievementCard.propTypes = {
  achievement: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    rarity: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    earnedBy: PropTypes.number.isRequired,
  }).isRequired,
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Leaderboards;
