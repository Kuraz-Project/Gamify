import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

const Login = () => {
	const navigate = useNavigate()
	const { login } = useAuth()
	const [showPassword, setShowPassword] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [rememberMe, setRememberMe] = useState(false)

	const handleSubmit = (e) => {
		e.preventDefault()
		// Mock login: either use existing user from localStorage or create a default one
		let user = null
		try {
			const stored = localStorage.getItem('user')
			if (stored && stored !== 'null' && stored !== 'undefined') {
				user = JSON.parse(stored)
			}
		} catch (err) {
			console.error('Error parsing user from localStorage:', err)
			// Optionally clear invalid data
			localStorage.removeItem('user')
		}

		if (!user) {
			user = {
				id: Date.now(),
				name: 'Guest User',
				email,
				avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
				points: 0,
				level: 'Beginner',
				badges: [],
				wallet: { balance: 0, transactions: [] },
			}
		}

		try {
			login(user)
			if (rememberMe) {
				localStorage.setItem('rememberEmail', email)
			} else {
				localStorage.removeItem('rememberEmail')
			}
			alert('Signed in successfully ✅')
			navigate('/')
		} catch (err) {
			console.error(err)
			alert('Could not sign in. Please try again.')
		}
	}

	return (
		<div style={{ minHeight: '100vh' }} className="flex items-center justify-center bg-slate-50 p-4">
			<div className="w-full max-w-md">
				<div className="mb-6">
					<Link to="/" className="text-sm text-blue-600 hover:underline">← Back to Home</Link>
				</div>
				<div className="bg-white shadow rounded-lg">
					<div className="p-6 text-center border-b">
						<div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">Q</div>
						<h2 className="text-2xl font-semibold">Welcome Back</h2>
						<p className="text-slate-500">Sign in to your account to continue learning</p>
					</div>
					<div className="p-6 space-y-6">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<label htmlFor="email" className="text-sm">Email</label>
								<input id="email" type="email" className="w-full border rounded p-2" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
							</div>

							<div className="space-y-2">
								<label htmlFor="password" className="text-sm">Password</label>
								<div className="relative">
									<input id="password" type={showPassword ? 'text' : 'password'} className="w-full border rounded p-2 pr-12" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
									<button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600">
										{showPassword ? 'Hide' : 'Show'}
									</button>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<label className="flex items-center gap-2 text-sm">
									<input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
									<span>Remember me</span>
								</label>
								<Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
							</div>

							<button type="submit" className="w-full bg-black text-white rounded p-2 hover:bg-blue-700">Sign In</button>
						</form>

						<div className="space-y-2">
							<hr />
							<div className="text-center">
								<span className="bg-white px-2 text-xs text-slate-500">Or continue with</span>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<button type="button" className="border rounded p-2 hover:bg-slate-50">Google</button>
								<button type="button" className="border rounded p-2 hover:bg-slate-50">Twitter</button>
							</div>
						</div>
					</div>
					<div className="text-center p-4">
						<p className="text-sm text-slate-600">Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign up</Link></p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Login


