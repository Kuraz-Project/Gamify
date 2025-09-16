import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const RegisterationPage = () => {
	const navigate = useNavigate()
	const [showPassword, setShowPassword] = useState(false)
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		interests: '',
		agreeToTerms: false,
	})

	const handleInputChange = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		if (!formData.agreeToTerms) {
			alert('Please agree to the terms and conditions')
			return
		}

		const today = new Date().toISOString().split('T')[0]
		const userData = {
			id: Date.now(),
			name: `${formData.firstName} ${formData.lastName}`.trim(),
			email: formData.email,
			avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
			points: 100,
			level: 'Beginner',
			badges: ['New Member'],
			interest: formData.interests,
			wallet: {
				balance: 10.0,
				transactions: [
					{ id: 1, type: 'earned', amount: 100, description: 'Welcome bonus points', date: today },
					{ id: 2, type: 'earned', amount: 10, description: 'Welcome bonus credits', date: today },
				],
			},
		}

		try {
			localStorage.setItem('user', JSON.stringify(userData))
			alert('Account created! Welcome aboard 🎉')
			navigate('/')
		} catch (err) {
			console.error(err)
			alert('Something went wrong saving your account. Please try again.')
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
						<div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 font-semibold">Q</div>
						<h2 className="text-2xl font-semibold">Create Account</h2>
						<p className="text-slate-500">Join our community and start earning rewards</p>
					</div>
					<div className="p-6 space-y-6">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<label htmlFor="firstName" className="text-sm">First Name</label>
									<input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} placeholder="John" className="w-full border rounded p-2" required />
								</div>
								<div className="space-y-2">
									<label htmlFor="lastName" className="text-sm">Last Name</label>
									<input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} placeholder="Doe" className="w-full border rounded p-2" required />
								</div>
							</div>

							<div className="space-y-2">
								<label htmlFor="email" className="text-sm">Email</label>
								<input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="john@example.com" className="w-full border rounded p-2" required />
							</div>

							<div className="space-y-2">
								<label htmlFor="password" className="text-sm">Password</label>
								<div className="relative">
									<input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="Create a strong password" className="w-full border rounded p-2 pr-12" minLength={8} required />
									<button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600">
										{showPassword ? 'Hide' : 'Show'}
									</button>
								</div>
								<p className="text-xs text-slate-500">Password must be at least 8 characters long</p>
							</div>

							<div className="space-y-2">
								<label htmlFor="interests" className="text-sm">Primary Interest</label>
								<select id="interests" className="w-full border rounded p-2" value={formData.interests} onChange={(e) => handleInputChange('interests', e.target.value)}>
									<option value="" disabled>Select your main interest</option>
									<option value="technology">Technology</option>
									<option value="business">Business</option>
									<option value="creative">Creative</option>
									<option value="finance">Finance</option>
									<option value="marketing">Marketing</option>
									<option value="health">Health & Wellness</option>
								</select>
							</div>

							<div className="flex items-start gap-2">
								<input id="terms" type="checkbox" checked={formData.agreeToTerms} onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)} className="mt-1" />
								<label htmlFor="terms" className="text-sm">
									I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
								</label>
							</div>

							<button type="submit" className="w-full bg-black text-white rounded p-2 hover:bg-blue-700">Create Account</button>
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
						<p className="text-sm text-slate-600">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link></p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default RegisterationPage


