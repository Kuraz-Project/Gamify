import React, { useState } from 'react'
import { useAuth } from '../App'
import { FaCoins, FaTrophy, FaArrowUp, FaArrowDown, FaPlus, FaMinus, FaWallet, FaExchangeAlt, FaHistory, FaGift, FaInfoCircle, FaTimes, FaCheck } from 'react-icons/fa'

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

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

const Wallet = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false)
  const [selectedReward, setSelectedReward] = useState(null)
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <FaWallet className="text-gray-400 text-6xl mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">Please log in to view your wallet.</p>
            <Button onClick={() => window.location.href = '/login'}>Log In</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const iconFor = (type) => {
    if (type === 'earned') return <FaArrowUp className="text-green-600" />
    if (type === 'deposit') return <FaPlus className="text-blue-600" />
    if (type === 'withdraw') return <FaMinus className="text-orange-600" />
    return <FaArrowDown className="text-red-600" />
  }

  // Mock data for demonstration
  const walletData = {
    points: user.points || 1250,
    balance: user.wallet?.balance || 150.00,
    lifetimeEarned: (user.points || 1250) + 500,
    transactions: user.wallet?.transactions || [
      { id: 1, type: 'earned', description: 'Attended AI Workshop', amount: 50, date: '2023-10-01' },
      { id: 2, type: 'deposit', description: 'Cash Deposit', amount: 100, date: '2023-09-28' },
      { id: 3, type: 'spent', description: 'Redeemed for Gift Card', amount: 25, date: '2023-09-25' },
      { id: 4, type: 'earned', description: 'Completed Challenge', amount: 75, date: '2023-09-20' }
    ],
    rewards: [
      { name: 'Amazon Gift Card', cost: 500, image: 'https://via.placeholder.com/100', description: 'Redeem for online shopping' },
      { name: 'Book Voucher', cost: 300, image: 'https://via.placeholder.com/100', description: 'Get books from your favorite store' },
      { name: 'Online Course', cost: 750, image: 'https://via.placeholder.com/100', description: 'Access premium learning content' }
    ],
    pointsHistory: [200, 450, 700, 950, 1250] // Mock points over time for chart
  }

  const handleDeposit = () => {
    setIsLoading(true)
    setTimeout(() => {
      alert(`Deposited $${depositAmount} successfully!`)
      setIsDepositModalOpen(false)
      setDepositAmount('')
      setIsLoading(false)
    }, 1000)
  }

  const handleWithdraw = () => {
    setIsLoading(true)
    setTimeout(() => {
      alert(`Withdrew $${withdrawAmount} successfully!`)
      setIsWithdrawModalOpen(false)
      setWithdrawAmount('')
      setIsLoading(false)
    }, 1000)
  }

  const handleRedeem = () => {
    setIsLoading(true)
    setTimeout(() => {
      alert(`Redeemed ${selectedReward.name} successfully!`)
      setIsRedeemModalOpen(false)
      setSelectedReward(null)
      setIsLoading(false)
    }, 1000)
  }

  const maxPoints = Math.max(...walletData.pointsHistory)
  const progressPercentage = (walletData.points / walletData.lifetimeEarned) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <FaWallet className="text-gray-600 text-xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Wallet</h1>
              <p className="text-gray-600">Manage your points, balance, and transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Points</p>
                  <p className="text-3xl font-bold text-gray-900">{walletData.points.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Available to spend</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaCoins className="text-gray-600 text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Wallet Balance</p>
                  <p className="text-3xl font-bold text-gray-900">${walletData.balance.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">Cash equivalent</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaWallet className="text-green-600 text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lifetime Earned</p>
                  <p className="text-3xl font-bold text-gray-900">{walletData.lifetimeEarned.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Total points earned</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaTrophy className="text-purple-600 text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Points Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div className="bg-gray-800 h-4 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p className="text-sm text-gray-600">{walletData.points} / {walletData.lifetimeEarned} points earned</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => setIsDepositModalOpen(true)}>
            <FaPlus className="mr-2" />
            Deposit Funds
          </Button>
          <Button size="lg" variant="outline" onClick={() => setIsWithdrawModalOpen(true)}>
            <FaMinus className="mr-2" />
            Withdraw Funds
          </Button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'overview', label: 'Transactions', icon: FaHistory },
                { id: 'rewards', label: 'Redeem Rewards', icon: FaGift },
                { id: 'convert', label: 'Convert Points', icon: FaExchangeAlt },
                { id: 'tips', label: 'Wallet Tips', icon: FaInfoCircle }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-gray-800 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Transaction History</h3>
                {/* Simple Chart */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h4 className="text-md font-semibold mb-4 text-gray-900">Points Over Time</h4>
                    <svg viewBox="0 0 400 100" className="w-full h-24">
                      <polyline
                        fill="none"
                        stroke="#374151"
                        strokeWidth="2"
                        points={walletData.pointsHistory.map((point, i) => `${i * 80 + 20},${100 - (point / maxPoints) * 80}`).join(' ')}
                      />
                    </svg>
                  </CardContent>
                </Card>
                <div className="space-y-4">
                  {walletData.transactions.map((t, i) => (
                    <Card key={t.id} className="hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              {iconFor(t.type)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{t.description}</p>
                              <p className="text-sm text-gray-500">{formatDate(t.date)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${(t.type === 'earned' || t.type === 'deposit') ? 'text-green-600' : 'text-red-600'}`}>
                              {(t.type === 'earned' || t.type === 'deposit') ? '+' : '-'}{t.amount} {t.type === 'earned' ? 'pts' : '$'}
                            </p>
                            <Badge variant={(t.type === 'earned' || t.type === 'deposit') ? 'default' : 'secondary'} className="text-xs mt-1">
                              {t.type}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {walletData.transactions.length === 0 && (
                    <div className="text-center py-8">
                      <FaHistory className="text-gray-400 text-4xl mx-auto mb-4" />
                      <p className="text-gray-600">No transactions yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'rewards' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Redeem Your Points</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {walletData.rewards.map((reward, idx) => (
                    <Card key={idx} className="text-center hover:shadow-xl">
                      <CardContent className="p-6">
                        <img src={reward.image} alt={reward.name} className="w-20 h-20 mx-auto mb-4 rounded-lg object-cover" />
                        <h4 className="font-semibold text-gray-900 mb-2">{reward.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                        <p className="text-sm font-medium text-gray-800 mb-4">{reward.cost} points</p>
                        <Button size="sm" disabled={walletData.points < reward.cost} onClick={() => { setSelectedReward(reward); setIsRedeemModalOpen(true); }}>
                          {walletData.points >= reward.cost ? 'Redeem' : 'Insufficient Points'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'convert' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Convert Points to Cash</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <FaExchangeAlt className="text-gray-400 text-4xl mx-auto" />
                      <p className="text-gray-600">Exchange rate: 100 points = $1</p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">You can convert {Math.floor(walletData.points / 100)} points to ${(walletData.points / 100).toFixed(2)}</p>
                      </div>
                      <Button size="lg" disabled={walletData.points < 100}>
                        Convert Points
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'tips' && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Wallet Tips</h3>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <FaInfoCircle className="text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">Earn More Points</h4>
                          <p className="text-sm text-gray-600">Participate in sessions and complete challenges to boost your points.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <FaInfoCircle className="text-green-600 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">Redeem Wisely</h4>
                          <p className="text-sm text-gray-600">Check reward availability and plan your redemptions for maximum value.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <FaInfoCircle className="text-purple-600 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-900">Secure Your Wallet</h4>
                          <p className="text-sm text-gray-600">Enable two-factor authentication to protect your funds.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} title="Deposit Funds">
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Enter amount ($)"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
          />
          <Button onClick={handleDeposit} disabled={!depositAmount || isLoading} className="w-full">
            {isLoading ? 'Processing...' : 'Deposit'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} title="Withdraw Funds">
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Enter amount ($)"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
          />
          <Button onClick={handleWithdraw} disabled={!withdrawAmount || isLoading} className="w-full">
            {isLoading ? 'Processing...' : 'Withdraw'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={isRedeemModalOpen} onClose={() => setIsRedeemModalOpen(false)} title={`Redeem ${selectedReward?.name}`}>
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to redeem {selectedReward?.name} for {selectedReward?.cost} points?</p>
          <Button onClick={handleRedeem} disabled={isLoading} className="w-full">
            {isLoading ? 'Redeeming...' : 'Confirm Redemption'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Wallet