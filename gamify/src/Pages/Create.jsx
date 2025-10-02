import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import {
  Calendar, Clock, Video, Users, Settings, Upload, Eye, Globe, Lock,
  Tag, FileText, Plus, X, Save, AlertCircle, CheckCircle
} from 'lucide-react';

// Custom UI Components
const Button = ({ children, variant = 'default', size = 'default', className = '', onClick, disabled, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus:ring-gray-500',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  const sizeClasses = {
    default: 'h-10 py-2 px-4',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-12 px-8 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = '', error, ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border ${error ? 'border-red-300' : 'border-gray-300'} bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

const Textarea = ({ className = '', error, ...props }) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border ${error ? 'border-red-300' : 'border-gray-300'} bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

const Select = ({ children, className = '', ...props }) => {
  return (
    <select
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

const Card = ({ children, className = '' }) => {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => {
  return <div className={`flex flex-col space-y-1.5 p-6 pb-4 ${className}`}>{children}</div>;
};

const CardTitle = ({ children, className = '' }) => {
  return <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
};

const CardContent = ({ children, className = '' }) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
};

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    destructive: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Switch = ({ checked, onCheckedChange, className = '' }) => {
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      } ${className}`}
      onClick={() => onCheckedChange(!checked)}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

const Create = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessionType, setSessionType] = useState('live'); // 'live' or 'scheduled'
  const [currentStep, setCurrentStep] = useState(1);
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
    scheduledDate: '',
    scheduledTime: '',
    duration: '60',
    privacy: 'public',
    allowChat: true,
    allowQuestions: true,
    moderationRequired: false,
    recordSession: true,
    maxParticipants: '',
    pointsReward: '',
    thumbnail: null,
  });
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Technology',
    'Healthcare',
    'Education',
    'Business',
    'Entertainment',
    'Finance',
    'Marketing',
    'Creative',
    'Health & Wellness',
  ];

  const durations = ['30', '60', '90', '120'];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnail: file }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.category) newErrors.category = 'Category is required';
    } else if (step === 2 && sessionType === 'scheduled') {
      if (!formData.scheduledDate) newErrors.scheduledDate = 'Date is required for scheduled sessions';
      if (!formData.scheduledTime) newErrors.scheduledTime = 'Time is required for scheduled sessions';
    } else if (step === 3) {
      if (formData.maxParticipants && isNaN(formData.maxParticipants)) {
        newErrors.maxParticipants = 'Must be a valid number';
      }
      if (formData.pointsReward && isNaN(formData.pointsReward)) {
        newErrors.pointsReward = 'Must be a valid number';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const sessionData = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        isLive: sessionType === 'live',
        startTime: sessionType === 'scheduled' ? `${formData.scheduledDate}T${formData.scheduledTime}` : new Date().toISOString(),
        duration: `${formData.duration}:00`,
        maxParticipants: formData.maxParticipants || 'Unlimited',
        pointsReward: formData.pointsReward || '0',
        participants: 0,
        privacy: formData.privacy,
        allowChat: formData.allowChat,
        allowQuestions: formData.allowQuestions,
        moderationRequired: formData.moderationRequired,
        recordSession: formData.recordSession,
        creator: {
          name: user?.name || 'Current User',
          avatar: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          title: user?.title || 'Session Creator',
        },
      };

      if (sessionType === 'live') {
        navigate('/liveSessions', { state: { session: sessionData } });
      } else {
        alert(`Session scheduled: ${formData.title}`);
        setFormData({
          title: '',
          description: '',
          category: '',
          tags: [],
          scheduledDate: '',
          scheduledTime: '',
          duration: '60',
          privacy: 'public',
          allowChat: true,
          allowQuestions: true,
          moderationRequired: false,
          recordSession: true,
          maxParticipants: '',
          pointsReward: '',
          thumbnail: null,
        });
        setCurrentStep(1);
      }
      setIsSubmitting(false);
      setIsPreview(false);
    }, 1000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Authentication Required</h2>
            <p className="text-gray-600 mt-2">Please log in to create a session.</p>
            <Button
              className="mt-6"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create a Live Session</h1>
          <p className="text-gray-600">Set up your live or scheduled Q&A session</p>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            {['Details', 'Schedule', 'Settings'].map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > index + 1
                      ? 'bg-green-500 text-white'
                      : currentStep === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > index + 1 ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                <span className="text-xs mt-1">{step}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {isPreview ? (
              <Card>
                <CardHeader>
                  <CardTitle>Session Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      {formData.thumbnail ? (
                        <img
                          src={URL.createObjectURL(formData.thumbnail)}
                          alt="Session thumbnail"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <Video className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">No thumbnail</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{formData.title || 'Session Title'}</h4>
                      <p className="text-sm text-gray-600 mt-1">{formData.description || 'No description'}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.category && <Badge variant="secondary">{formData.category}</Badge>}
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="default">{tag}</Badge>
                        ))}
                      </div>
                      {sessionType === 'scheduled' && formData.scheduledDate && (
                        <p className="text-sm text-gray-600 mt-2">
                          Scheduled for: {new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toLocaleString()}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">Privacy: {formData.privacy}</p>
                      <p className="text-sm text-gray-600">Max Participants: {formData.maxParticipants || 'Unlimited'}</p>
                      <p className="text-sm text-gray-600">Points Reward: {formData.pointsReward || '0'}</p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setIsPreview(false)}>
                      Back to Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {currentStep === 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                        <div className="flex gap-4">
                          <Button
                            variant={sessionType === 'live' ? 'default' : 'outline'}
                            onClick={() => setSessionType('live')}
                          >
                            Live Now
                          </Button>
                          <Button
                            variant={sessionType === 'scheduled' ? 'default' : 'outline'}
                            onClick={() => setSessionType('scheduled')}
                          >
                            Schedule
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <Input
                          placeholder="Enter session title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          error={errors.title}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <Textarea
                          placeholder="Describe your session"
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          error={errors.description}
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <Select
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                        >
                          <option value="" disabled>Select a category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </Select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                          />
                          <Button size="sm" onClick={handleAddTag}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <button onClick={() => handleRemoveTag(tag)}>
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" onClick={() => document.getElementById('thumbnail-upload').click()}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </Button>
                          <input
                            id="thumbnail-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleThumbnailUpload}
                          />
                          {formData.thumbnail && <span className="text-sm text-gray-600">{formData.thumbnail.name}</span>}
                        </div>
                      </div>

                      <Button className="w-full" onClick={handleNextStep}>
                        Next
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {currentStep === 2 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Schedule & Rewards
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {sessionType === 'scheduled' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                            <Input
                              type="date"
                              value={formData.scheduledDate}
                              onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                              error={errors.scheduledDate}
                            />
                            {errors.scheduledDate && <p className="text-red-500 text-xs mt-1">{errors.scheduledDate}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                            <Input
                              type="time"
                              value={formData.scheduledTime}
                              onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                              error={errors.scheduledTime}
                            />
                            {errors.scheduledTime && <p className="text-red-500 text-xs mt-1">{errors.scheduledTime}</p>}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                        <Select
                          value={formData.duration}
                          onChange={(e) => handleInputChange('duration', e.target.value)}
                        >
                          {durations.map((duration) => (
                            <option key={duration} value={duration}>{duration} minutes</option>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Points Reward</label>
                        <Input
                          type="number"
                          placeholder="Points for participants (optional)"
                          value={formData.pointsReward}
                          onChange={(e) => handleInputChange('pointsReward', e.target.value)}
                          error={errors.pointsReward}
                        />
                        {errors.pointsReward && <p className="text-red-500 text-xs mt-1">{errors.pointsReward}</p>}
                      </div>

                      <div className="flex gap-4">
                        <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(1)}>
                          Back
                        </Button>
                        <Button className="flex-1" onClick={handleNextStep}>
                          Next
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {currentStep === 3 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Privacy & Interaction
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={formData.privacy === 'public' ? 'default' : 'outline'}
                            onClick={() => handleInputChange('privacy', 'public')}
                            className="flex items-center gap-2"
                          >
                            <Globe className="h-4 w-4" />
                            Public
                          </Button>
                          <Button
                            variant={formData.privacy === 'private' ? 'default' : 'outline'}
                            onClick={() => handleInputChange('privacy', 'private')}
                            className="flex items-center gap-2"
                          >
                            <Lock className="h-4 w-4" />
                            Private
                          </Button>
                          <Button
                            variant={formData.privacy === 'unlisted' ? 'default' : 'outline'}
                            onClick={() => handleInputChange('privacy', 'unlisted')}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Unlisted
                          </Button>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <p><strong>Public:</strong> Anyone can find and join</p>
                          <p><strong>Private:</strong> Invite only</p>
                          <p><strong>Unlisted:</strong> Only those with the link can join</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                        <Input
                          type="number"
                          placeholder="Unlimited"
                          value={formData.maxParticipants}
                          onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                          error={errors.maxParticipants}
                        />
                        {errors.maxParticipants && <p className="text-red-500 text-xs mt-1">{errors.maxParticipants}</p>}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Allow Chat</p>
                            <p className="text-sm text-gray-600">Let participants chat during session</p>
                          </div>
                          <Switch
                            checked={formData.allowChat}
                            onCheckedChange={(checked) => handleInputChange('allowChat', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Allow Questions</p>
                            <p className="text-sm text-gray-600">Enable Q&A feature</p>
                          </div>
                          <Switch
                            checked={formData.allowQuestions}
                            onCheckedChange={(checked) => handleInputChange('allowQuestions', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Moderation Required</p>
                            <p className="text-sm text-gray-600">Approve messages before showing</p>
                          </div>
                          <Switch
                            checked={formData.moderationRequired}
                            onCheckedChange={(checked) => handleInputChange('moderationRequired', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Record Session</p>
                            <p className="text-sm text-gray-600">Save for later viewing</p>
                          </div>
                          <Switch
                            checked={formData.recordSession}
                            onCheckedChange={(checked) => handleInputChange('recordSession', checked)}
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(2)}>
                          Back
                        </Button>
                        <Button className="flex-1" onClick={() => setIsPreview(true)}>
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    {formData.thumbnail ? (
                      <img
                        src={URL.createObjectURL(formData.thumbnail)}
                        alt="Session thumbnail"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <Video className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">No thumbnail</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{formData.title || 'Session Title'}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {formData.category && <Badge variant="secondary" className="text-xs mr-2">{formData.category}</Badge>}
                      {sessionType === 'scheduled' && formData.scheduledDate && (
                        <span>{new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {currentStep === 3 && !isPreview && (
              <Button
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {sessionType === 'live' ? 'Start Live Session' : 'Schedule Session'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;