import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { User, Sparkles, Mail, Lock, Award, Globe, CheckCircle2, ArrowLeft } from 'lucide-react'

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [activeTab, setActiveTab] = useState('user')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    interests: '',
    expertise: '',
    portfolioUrl: '',
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    else if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Password must contain at least one uppercase letter'
    else if (!/[0-9]/.test(formData.password)) newErrors.password = 'Password must contain at least one number'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required'
    else if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Passwords do not match'

    if (activeTab === 'user' && !formData.interests) newErrors.interests = 'Please select an interest'
    if (activeTab === 'creator' && !formData.expertise) newErrors.expertise = 'Please specify your expertise'
    if (activeTab === 'creator' && !formData.portfolioUrl) newErrors.portfolioUrl = 'Portfolio URL is required'
    else if (activeTab === 'creator' && formData.portfolioUrl && !/^https?:\/\/.+\..+/.test(formData.portfolioUrl)) {
      newErrors.portfolioUrl = 'Invalid URL format'
    }

    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      const userData = {
        id: Date.now(),
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        role: activeTab,
        interests: formData.interests || undefined,
        expertise: formData.expertise || undefined,
        portfolioUrl: formData.portfolioUrl || undefined,
        points: 0,
        level: activeTab === 'creator' ? 'Expert' : 'Beginner',
        badges: [],
        wallet: { balance: 0, transactions: [] },
      }
      login(userData)
      alert(`${activeTab === 'user' ? 'Learner' : 'Creator'} account created successfully!`)
      navigate('/')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const isUser = activeTab === 'user'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-semibold">G</div>
            <h2 className="text-2xl font-semibold text-gray-900">Create Account</h2>
            <p className="text-gray-600">Join as a {isUser ? 'Learner' : 'Creator'} and start your journey</p>
          </div>
          <div className="flex justify-center mb-6">
            <div className="grid grid-cols-2 w-full max-w-xs bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('user')}
                className={`py-2 rounded-lg font-medium transition-all duration-200 ${
                  isUser ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-300'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Learner
              </button>
              <button
                onClick={() => setActiveTab('creator')}
                className={`py-2 rounded-lg font-medium transition-all duration-200 ${
                  !isUser ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-300'
                }`}
              >
                <Sparkles className="w-4 h-4 inline mr-2" />
                Creator
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Lock className="w-4 h-4 inline mr-1" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Lock className="w-4 h-4 inline mr-1" />
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            {isUser ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Award className="w-4 h-4 inline mr-1" />
                  Primary Interest
                </label>
                <select
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Select your main interest</option>
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="creative">Creative</option>
                  <option value="finance">Finance</option>
                  <option value="marketing">Marketing</option>
                  <option value="health">Health & Wellness</option>
                </select>
                {errors.interests && <p className="text-red-500 text-xs mt-1">{errors.interests}</p>}
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    Area of Expertise
                  </label>
                  <input
                    type="text"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., AI in Healthcare, Startup Strategy"
                  />
                  {errors.expertise && <p className="text-red-500 text-xs mt-1">{errors.expertise}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://yourportfolio.com"
                  />
                  {errors.portfolioUrl && <p className="text-red-500 text-xs mt-1">{errors.portfolioUrl}</p>}
                </div>
              </>
            )}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </label>
              {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>}
            </div>
            <button
              onClick={handleSubmit}
              className={`w-full py-2.5 rounded-md font-semibold text-white transition-all hover:shadow-md ${
                isUser ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Create {isUser ? 'Learner' : 'Creator'} Account
            </button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register