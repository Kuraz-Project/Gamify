import React from 'react'
import { useAuth } from '../App'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Separator } from './ui/other'
import { FaWallet, FaChartLine, FaArrowUp, FaArrowDown, FaPlus, FaMinus, FaTrophy, FaCoins } from 'react-icons/fa'

const Wallet = () => {
  const { user } = useAuth()
  if (!user) return (<div className="container mx-auto px-4 py-8"><div className="text-center"><h1>Please log in to view your wallet</h1></div></div>)

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})
  const iconFor = (type) => type === 'earned' ? <FaArrowUp className="text-green-600" /> : type === 'deposit' ? <FaPlus className="text-blue-600" /> : type === 'withdraw' ? <FaMinus className="text-orange-600" /> : <FaArrowDown className="text-red-600" />

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600/10 rounded-full flex items-center justify-center"><FaWallet className="text-blue-600" /></div>
        <div>
          <h1 className="text-3xl font-bold">My Wallet</h1>
          <p className="text-gray-600">Manage your points and transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="pb-3"><CardTitle className="text-blue-700 flex items-center gap-2"><FaTrophy /> Current Points</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-blue-800">{user.points?.toLocaleString()}</div><p className="text-sm text-blue-600 mt-1">Available to spend</p></CardContent>
        </Card>
        <Card className="border-green-200">
          <CardHeader className="pb-3"><CardTitle className="text-green-700 flex items-center gap-2"><FaCoins /> Wallet Balance</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-green-800">${user.wallet?.balance}</div><p className="text-sm text-green-600 mt-1">Cash equivalent</p></CardContent>
        </Card>
        <Card className="border-purple-200">
          <CardHeader className="pb-3"><CardTitle className="text-purple-700 flex items-center gap-2"><FaChartLine /> Lifetime Earned</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-purple-800">{(user.points + 1250).toLocaleString()}</div><p className="text-sm text-purple-600 mt-1">Total points earned</p></CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-700"><FaPlus className="mr-2" /> Deposit Funds</Button>
        <Button size="lg" variant="outline" className="flex-1"><FaMinus className="mr-2" /> Withdraw Funds</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Transaction History</CardTitle><CardDescription>Your recent wallet activity</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          {(user.wallet?.transactions || []).map((t, i) => (
            <div key={t.id}>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">{iconFor(t.type)}<div><p className="font-medium">{t.description}</p><p className="text-sm text-gray-600">{formatDate(t.date)}</p></div></div>
                <div className="text-right">
                  <div className={`font-medium ${(t.type === 'earned' || t.type === 'deposit') ? 'text-green-600' : 'text-red-600'}`}>{(t.type === 'earned' || t.type === 'deposit') ? '+' : '-'}{t.amount} {t.type === 'earned' ? 'pts' : '$'}</div>
                  <Badge variant={(t.type === 'earned' || t.type === 'deposit') ? 'default' : 'secondary'} className="text-xs">{t.type}</Badge>
                </div>
              </div>
              {i < (user.wallet?.transactions?.length || 0) - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default Wallet


