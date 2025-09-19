import React, { useState, useEffect } from 'react';
import { 
    Play, 
    Pause, 
    Volume2, 
    VolumeX, 
    Maximize, 
    Settings, 
    Users, 
    MessageCircle, 
    Send, 
    ThumbsUp, 
    Share2,
    Mic,
    MicOff,
    Video,
    VideoOff,
    Hand,
    Star,
    Flag,
    MoreVertical,
    Crown,
    Heart
    } from 'lucide-react';

    const sessionData = {
    id: 1,
    title: 'AI in Healthcare: Future Trends and Applications',
    creator: {
        name: 'Dr. Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
        title: 'AI Healthcare Specialist',
        rating: 4.9,
        followers: 12500
    },
    isLive: true,
    viewers: 1247,
    duration: '45:32',
    category: 'Technology',
    description: 'Join Dr. Sarah Chen as she explores the latest AI applications in healthcare, discusses breakthrough technologies, and answers your questions about the future of medical AI.',
    startTime: '2:00 PM EST',
    tags: ['AI', 'Healthcare', 'Technology', 'Innovation', 'Medical']
    };

    const chatMessages = [
    {
        id: 1,
        user: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        message: 'This is fascinating! Can you explain more about AI-powered diagnostics?',
        timestamp: '2:15 PM',
        isQuestion: true,
        likes: 12,
        isModerator: false
    },
    {
        id: 2,
        user: 'Maria Garcia',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=40&h=40&fit=crop&crop=face',
        message: 'Great session! The examples are very clear.',
        timestamp: '2:16 PM',
        isQuestion: false,
        likes: 8,
        isModerator: false
    },
    {
        id: 3,
        user: 'Dr. Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face',
        message: '@Alex Johnson Great question! AI diagnostics can analyze medical images 10x faster than traditional methods...',
        timestamp: '2:17 PM',
        isQuestion: false,
        likes: 25,
        isModerator: true
    },
    {
        id: 4,
        user: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=40&h=40&fit=crop&crop=face',
        message: 'What about privacy concerns with patient data in AI systems?',
        timestamp: '2:18 PM',
        isQuestion: true,
        likes: 15,
        isModerator: false
    },
    {
        id: 5,
        user: 'Lisa Park',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        message: 'Thank you for explaining that! Very helpful 👍',
        timestamp: '2:19 PM',
        isQuestion: false,
        likes: 5,
        isModerator: false
    }
];

const questionQueue = [
    {
        id: 1,
        user: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        question: 'How do you see AI changing surgical procedures in the next 5 years?',
        votes: 23,
        timestamp: '2:20 PM'
    },
    {
        id: 2,
        user: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=40&h=40&fit=crop&crop=face',
        question: 'What are the main challenges in implementing AI in rural healthcare?',
        votes: 18,
        timestamp: '2:21 PM'
    },
    {
        id: 3,
        user: 'Michael Torres',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        question: 'Can you share examples of successful AI healthcare startups?',
        votes: 15,
        timestamp: '2:22 PM'
    }
    ];

    // Custom UI Components using Tailwind
    const Button = ({ children, variant = 'default', size = 'default', className = '', onClick, ...props }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    const variantClasses = {
        default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus:ring-gray-500',
        ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    };
    const sizeClasses = {
        default: 'h-10 py-2 px-4',
        sm: 'h-8 px-3 text-sm',
        lg: 'h-12 px-8',
    };

    return (
        <button
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        onClick={onClick}
        {...props}
        >
        {children}
        </button>
    );
    };

    const Badge = ({ children, variant = 'default', className = '' }) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const variantClasses = {
        default: 'bg-blue-100 text-blue-800',
        secondary: 'bg-gray-100 text-gray-800',
        outline: 'border border-gray-300 text-gray-700',
    };

    return (
        <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
        {children}
        </span>
    );
    };

    const Input = ({ className = '', ...props }) => {
    return (
        <input
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
        />
    );
    };

    const Avatar = ({ children, className = '' }) => {
    return (
        <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
        {children}
        </div>
    );
    };

    const AvatarImage = ({ src, alt = '' }) => {
    return <img className="aspect-square h-full w-full object-cover" src={src} alt={alt} />;
    };

    const AvatarFallback = ({ children }) => {
    return (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium">
        {children}
        </div>
    );
    };

    const Card = ({ children, className = '' }) => {
    return (
        <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
        {children}
        </div>
    );
    };

    const CardContent = ({ children, className = '' }) => {
    return <div className={`p-6 ${className}`}>{children}</div>;
    };

    const Separator = ({ orientation = 'horizontal', className = '' }) => {
    return (
        <div 
        className={`shrink-0 bg-gray-200 ${
            orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px'
        } ${className}`} 
        />
    );
    };

    function LiveSession() {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState('chat');

    const [messages, setMessages] = useState(chatMessages);
    const [questions, setQuestions] = useState(questionQueue);

    const handleSendMessage = () => {
        if (!chatMessage.trim()) return;
        
        const newMessage = {
        id: messages.length + 1,
        user: 'You',
        avatar: '',
        message: chatMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isQuestion: chatMessage.includes('?'),
        likes: 0,
        isModerator: false
        };
        
        setMessages([...messages, newMessage]);
        setChatMessage('');
    };

    const handleLikeMessage = (messageId) => {
        setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg
        ));
    };

    const handleVoteQuestion = (questionId) => {
        setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, votes: q.votes + 1 } : q
        ));
    };

    return (
        <div className="min-h-screen bg-black">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row h-screen">
            {/* Video Section */}
            <div className="flex-1 flex flex-col">
            {/* Video Player */}
            <div className="relative bg-gray-900 flex-1 flex items-center justify-center">
                {/* Video Placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">Live Session in Progress</h3>
                    <p className="text-gray-300">HD Quality • {sessionData.viewers.toLocaleString()} viewers</p>
                </div>
                </div>

                {/* Live Badge */}
                <div className="absolute top-4 left-4">
                <Badge className="bg-red-500 text-white flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    LIVE
                </Badge>
                </div>

                {/* Viewer Count */}
                <div className="absolute top-4 right-4 bg-black/50 rounded-lg px-3 py-1 flex items-center gap-2">
                <Users className="h-4 w-4 text-white" />
                <span className="text-white text-sm">{sessionData.viewers.toLocaleString()}</span>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={() => setIsMuted(!isMuted)}
                    >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    <span className="text-white text-sm">{sessionData.duration}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Settings className="h-5 w-5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Maximize className="h-5 w-5" />
                    </Button>
                    </div>
                </div>
                </div>
            </div>

            {/* Session Info */}
            <div className="bg-white border-t p-6">
                <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2 text-gray-900">{sessionData.title}</h1>
                    <p className="text-gray-600 mb-4">{sessionData.description}</p>
                    <div className="flex flex-wrap gap-2">
                    {sessionData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                    </Button>
                    <Button variant="outline" size="sm">
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                    </Button>
                </div>
                </div>

                {/* Creator Info */}
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                    <AvatarImage src={sessionData.creator.avatar} />
                    <AvatarFallback>{sessionData.creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                    <h3 className="font-semibold text-gray-900">{sessionData.creator.name}</h3>
                    <p className="text-sm text-gray-600">{sessionData.creator.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{sessionData.creator.rating}</span>
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <span className="text-sm text-gray-600">
                        {sessionData.creator.followers.toLocaleString()} followers
                        </span>
                    </div>
                    </div>
                </div>
                <Button
                    onClick={() => setIsFollowing(!isFollowing)}
                    variant={isFollowing ? "outline" : "default"}
                >
                    {isFollowing ? (
                    <>
                        <Heart className="h-4 w-4 mr-2 fill-red-500 text-red-500" />
                        Following
                    </>
                    ) : (
                    <>
                        <Heart className="h-4 w-4 mr-2" />
                        Follow
                    </>
                    )}
                </Button>
                </div>
            </div>
            </div>

            {/* Side Panel */}
            <div className="w-full lg:w-96 bg-white border-l flex flex-col">
            {/* Participant Controls */}
            <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Participant Controls</h3>
                <Badge variant="outline">{sessionData.viewers.toLocaleString()} viewers</Badge>
                </div>
                <div className="grid grid-cols-4 gap-2">
                <Button
                    size="sm"
                    variant={isHandRaised ? "default" : "outline"}
                    onClick={() => setIsHandRaised(!isHandRaised)}
                >
                    <Hand className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant={isMicOn ? "default" : "outline"}
                    onClick={() => setIsMicOn(!isMicOn)}
                >
                    {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                <Button
                    size="sm"
                    variant={isVideoOn ? "default" : "outline"}
                    onClick={() => setIsVideoOn(!isVideoOn)}
                >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="outline">
                    <MoreVertical className="h-4 w-4" />
                </Button>
                </div>
            </div>

            {/* Chat and Questions Tabs */}
            <div className="flex-1 flex flex-col">
                {/* Tab Headers */}
                <div className="grid grid-cols-2 m-4 mb-0 bg-gray-100 rounded-lg p-1">
                <button
                    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'chat'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab('chat')}
                >
                    Chat
                </button>
                <button
                    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'questions'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab('questions')}
                >
                    Questions
                </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'chat' && (
                <div className="flex-1 flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 p-4 overflow-y-auto max-h-96">
                    <div className="space-y-4">
                        {messages.map((message) => (
                        <div key={message.id} className="group">
                            <div className="flex gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={message.avatar} />
                                <AvatarFallback>{message.user.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm text-gray-900">{message.user}</span>
                                {message.isModerator && (
                                    <Crown className="h-3 w-3 text-yellow-500" />
                                )}
                                <span className="text-xs text-gray-500">{message.timestamp}</span>
                                </div>
                                <p className={`text-sm break-words text-gray-700 ${
                                message.isQuestion ? 'bg-blue-50 p-2 rounded border-l-2 border-blue-500' : ''
                                }`}>
                                {message.message}
                                </p>
                                <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => handleLikeMessage(message.id)}
                                >
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    {message.likes}
                                </Button>
                                </div>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t">
                    <div className="flex gap-2">
                        <Input
                        placeholder="Type your message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                        />
                        <Button size="sm" onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    </div>
                </div>
                )}

                {activeTab === 'questions' && (
                <div className="flex-1 flex flex-col">
                    {/* Question Queue */}
                    <div className="flex-1 p-4 overflow-y-auto max-h-96">
                    <div className="space-y-4">
                        <div className="text-sm text-gray-600 mb-4">
                        Questions are sorted by votes. The creator will answer top questions.
                        </div>
                        
                        {questions.map((question) => (
                        <Card key={question.id} className="group hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                            <div className="flex gap-3">
                                <Avatar className="w-8 h-8">
                                <AvatarImage src={question.avatar} />
                                <AvatarFallback>{question.user.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium text-sm text-gray-900">{question.user}</span>
                                    <span className="text-xs text-gray-500">{question.timestamp}</span>
                                </div>
                                <p className="text-sm mb-3 text-gray-700">{question.question}</p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleVoteQuestion(question.id)}
                                    className="h-7 px-3"
                                >
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    {question.votes}
                                </Button>
                                </div>
                            </div>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                    </div>

                    {/* Ask Question */}
                    <div className="p-4 border-t">
                    <Button className="w-full">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Ask a Question
                    </Button>
                    </div>
                </div>
                )}
            </div>
            </div>
        </div>
        </div>
    );
}

export default LiveSession;