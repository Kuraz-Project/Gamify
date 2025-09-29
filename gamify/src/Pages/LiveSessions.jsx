import React, { useState, useEffect, useRef } from 'react';
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
    Heart,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Clock,
    Eye,
    MessageSquare,
    HelpCircle
} from 'lucide-react';

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
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState('chat');
    const [showEmoji, setShowEmoji] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('connected');

    const [messages, setMessages] = useState([]);
    const [questions, setQuestions] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                const response = await fetch('/src/db.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch session data');
                }

                const data = await response.json();

                if (!data.liveSessions?.currentSession) {
                    throw new Error('Session data not found');
                }

                setSessionData(data.liveSessions.currentSession);
                setMessages(data.liveSessions.chat.messages || []);
                setQuestions(data.liveSessions.questionQueue.questions || []);

                // Simulate real-time updates
                const interval = setInterval(() => {
                    setSessionData(prev => prev ? {
                        ...prev,
                        status: {
                            ...prev.status,
                            viewers: prev.status.viewers + Math.floor(Math.random() * 3) - 1,
                            duration: new Date(Date.now() - new Date(prev.status.startTime).getTime()).toISOString().substr(11, 8)
                        }
                    } : null);
                }, 5000);

                return () => clearInterval(interval);

            } catch (err) {
                console.error('Error fetching session data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSessionData();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!chatMessage.trim() || !sessionData) return;

        const newMessage = {
            id: Date.now(),
            user: 'You',
            avatar: '',
            message: chatMessage.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isQuestion: chatMessage.includes('?'),
            likes: 0,
            isModerator: false
        };

        setMessages(prev => [...prev, newMessage]);
        setChatMessage('');

        // Simulate server response
        setTimeout(() => {
            setMessages(prev => prev.map(msg =>
                msg.id === newMessage.id ? { ...msg, id: msg.id + 1000 } : msg
            ));
        }, 1000);
    };

    const handleLikeMessage = (messageId) => {
        setMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg
        ));
    };

    const handleVoteQuestion = (questionId) => {
        setQuestions(prev => prev.map(q =>
            q.id === questionId ? { ...q, votes: q.votes + 1 } : q
        ));
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: sessionData?.title,
                    text: sessionData?.metadata?.description,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                // You could show a toast notification here
            }
        } catch (err) {
            console.log('Error sharing:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
                    <h3 className="text-xl font-semibold mb-2">Loading Live Session</h3>
                    <p className="text-gray-400">Connecting to stream...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                    <h3 className="text-xl font-semibold mb-2">Connection Error</h3>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Retry Connection
                    </Button>
                </div>
            </div>
        );
    }

    if (!sessionData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Session Not Found</h3>
                    <p className="text-gray-400">The live session you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-black">
            {/* Main Content */}
            <div className="flex flex-col lg:flex-row h-screen">
                {/* Video Section */}
                <div className="flex-1 flex flex-col">
                    {/* Video Player */}
                    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black flex-1 flex items-center justify-center group">
                        {/* Video Placeholder with Enhanced Design */}
                        <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
                            {/* Animated Background Pattern */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse"></div>
                                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
                            </div>

                            <div className="text-center relative z-10">
                                {/* Enhanced Play Button */}
                                <div className="relative mb-6">
                                    <div className="w-28 h-28 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                                        <Play className="h-16 w-16 text-white ml-2" />
                                    </div>
                                    {/* Ripple Effect */}
                                    <div className="absolute inset-0 w-28 h-28 rounded-full border-2 border-white/30 animate-ping mx-auto"></div>
                                </div>

                                <h3 className="text-white text-2xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    Live Session in Progress
                                </h3>
                                <div className="flex items-center justify-center gap-4 text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium">HD Quality</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        <span className="font-semibold">{sessionData?.status?.viewers?.toLocaleString() || 0}</span>
                                        <span className="text-sm">viewers</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Live Badge */}
                        <div className="absolute top-6 left-6 z-20">
                            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm bg-black/20">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                </span>
                                <span className="font-bold text-sm tracking-wide">LIVE</span>
                            </div>
                        </div>

                        {/* Enhanced Viewer Count */}
                        <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2 border border-white/10">
                            <Users className="h-5 w-5 text-white" />
                            <span className="text-white font-semibold">{sessionData?.status?.viewers?.toLocaleString() || 0}</span>
                        </div>

                        {/* Connection Status Indicator */}
                        <div className="absolute top-6 right-6 space-y-1">
                            <div className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'} shadow-lg`}></div>
                        </div>

                        {/* Enhanced Video Controls */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-white hover:bg-white/20 hover:scale-110 transition-all duration-200"
                                        onClick={() => setIsPlaying(!isPlaying)}
                                    >
                                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-white hover:bg-white/20 hover:scale-110 transition-all duration-200"
                                        onClick={() => setIsMuted(!isMuted)}
                                    >
                                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                    </Button>
                                    <div className="bg-black/40 rounded-lg px-3 py-1">
                                        <span className="text-white text-sm font-mono">{sessionData?.status?.duration}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-white hover:bg-white/20 hover:scale-110 transition-all duration-200"
                                        title="Quality Settings"
                                    >
                                        <Settings className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-white hover:bg-white/20 hover:scale-110 transition-all duration-200"
                                        title="Fullscreen"
                                    >
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
                                <h1 className="text-2xl font-bold mb-2 text-gray-900">{sessionData?.title}</h1>
                                <p className="text-gray-600 mb-4">{sessionData?.metadata?.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {sessionData?.metadata?.tags?.map((tag) => (
                                        <Badge key={tag} variant="secondary">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleShare}
                                >
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
                                    {sessionData?.creator?.avatar ? (
                                        <AvatarImage src={sessionData.creator.avatar} />
                                    ) : (
                                        <AvatarFallback>{sessionData?.creator?.name?.charAt(0)}</AvatarFallback>
                                    )}
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{sessionData?.creator?.name}</h3>
                                    <p className="text-sm text-gray-600">{sessionData?.creator?.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm">{sessionData?.creator?.rating}</span>
                                            <Separator orientation="vertical" className="h-4" />
                                            <span className="text-sm text-gray-600">
                                                {sessionData?.creator?.followers?.toLocaleString() || 0} followers
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
                </div>

                {/* Side Panel */}
                <div className="w-full lg:w-96 bg-white border-l flex flex-col">
                    {/* Enhanced Participant Controls */}
                    <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900">Participant Controls</h3>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-white/50">
                                    <Eye className="h-3 w-3 mr-1" />
                                    {sessionData?.status?.viewers?.toLocaleString() || 0} viewers
                                </Badge>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            <Button
                                size="sm"
                                variant={isHandRaised ? "default" : "outline"}
                                onClick={() => setIsHandRaised(!isHandRaised)}
                                className={`h-12 flex flex-col gap-1 ${isHandRaised ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                title={isHandRaised ? "Lower Hand" : "Raise Hand"}
                            >
                                <Hand className="h-4 w-4" />
                                <span className="text-xs">Hand</span>
                            </Button>
                            <Button
                                size="sm"
                                variant={isMicOn ? "default" : "outline"}
                                onClick={() => setIsMicOn(!isMicOn)}
                                className={`h-12 flex flex-col gap-1 ${isMicOn ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                title={isMicOn ? "Turn Off Mic" : "Turn On Mic"}
                            >
                                {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                                <span className="text-xs">Mic</span>
                            </Button>
                            <Button
                                size="sm"
                                variant={isVideoOn ? "default" : "outline"}
                                onClick={() => setIsVideoOn(!isVideoOn)}
                                className={`h-12 flex flex-col gap-1 ${isVideoOn ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                                title={isVideoOn ? "Turn Off Camera" : "Turn On Camera"}
                            >
                                {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                                <span className="text-xs">Video</span>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-12 flex flex-col gap-1 hover:bg-gray-100"
                                title="More Options"
                            >
                                <MoreVertical className="h-4 w-4" />
                                <span className="text-xs">More</span>
                            </Button>
                        </div>

                        {/* Status Indicators */}
                        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-600">
                            {isHandRaised && (
                                <div className="flex items-center gap-1 text-blue-600">
                                    <Hand className="h-3 w-3" />
                                    <span>Hand Raised</span>
                                </div>
                            )}
                            {isMicOn && (
                                <div className="flex items-center gap-1 text-green-600">
                                    <Mic className="h-3 w-3" />
                                    <span>Mic On</span>
                                </div>
                            )}
                            {isVideoOn && (
                                <div className="flex items-center gap-1 text-purple-600">
                                    <Video className="h-3 w-3" />
                                    <span>Video On</span>
                                </div>
                            )}
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
                                                        {message.avatar ? (
                                                            <AvatarImage src={message.avatar} />
                                                        ) : (
                                                            <AvatarFallback>{message.user.charAt(0)}</AvatarFallback>
                                                        )}
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

                                {/* Enhanced Chat Input */}
                                <div className="p-4 border-t bg-gray-50">
                                    <div className="flex gap-2 items-end">
                                        <div className="flex-1 relative">
                                            <Input
                                                placeholder="Type your message..."
                                                value={chatMessage}
                                                onChange={(e) => setChatMessage(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                                                className="flex-1 pr-12 resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                disabled={!sessionData}
                                            />
                                            {/* Character Count */}
                                            <div className="absolute right-3 bottom-2 text-xs text-gray-400">
                                                {chatMessage.length}/280
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={handleSendMessage}
                                            disabled={!chatMessage.trim() || !sessionData}
                                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed h-10 px-4"
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                        <span>Press Enter to send, Shift+Enter for new line</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`flex items-center gap-1 ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                                                <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                                            </span>
                                        </div>
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
                                                            {question.avatar ? (
                                                                <AvatarImage src={question.avatar} />
                                                            ) : (
                                                                <AvatarFallback>{question.user.charAt(0)}</AvatarFallback>
                                                            )}
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
