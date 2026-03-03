import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Loader, ExternalLink, Bot } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import chatbotService from '@/lib/chatbotService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestedLink?: string;
  suggestedLinkText?: string;
}

// Service categories with keywords for smart detection
const SERVICE_CATEGORIES = {
  webDevelopment: {
    name: 'Web Development',
    link: '/web-development',
    keywords: ['web', 'website', 'web development', 'web app', 'frontend', 'backend', 'full stack', 'build website', 'develop website', 'responsive']
  },
  branding: {
    name: 'Branding & Identity',
    link: '/branding-identity',
    keywords: ['brand', 'branding', 'identity', 'logo', 'logo design', 'visual identity', 'brand design', 'corporate identity']
  },
  uiux: {
    name: 'UI/UX Design',
    link: '/uiux-design',
    keywords: ['ui', 'ux', 'interface', 'user experience', 'ui design', 'ux design', 'app design', 'interface design', 'wireframe']
  },
  animation3d: {
    name: '3D Animation',
    link: '/3d-animation',
    keywords: ['3d', 'animation', '3d animation', 'motion', 'motion graphics', 'visual effects', 'vfx', 'rendering', 'animated']
  },
  services: {
    name: 'All Services',
    link: '/services',
    keywords: ['order', 'services', 'offerings', 'what do you offer', 'your services']
  },
  portfolio: {
    name: 'Portfolio',
    link: '/#portfolio',
    keywords: ['portfolio', 'case study', 'showcase', 'examples', 'previous work', 'show me your work', 'your projects', 'featured projects', 'our work', 'past projects']
  },
  career: {
    name: 'Career',
    link: '/apply-employee',
    keywords: ['join team', 'team member', 'employment opportunity', 'vacancy', 'opening', 'position available', 'hiring', 'recruitment']
  },
  blog: {
    name: 'Blog',
    link: '/blog',
    keywords: ['blog', 'article', 'news', 'insights', 'tutorial', 'guide']
  }
};

const QUICK_QUESTIONS = [
  'Tell me about your services',
  "What's the pricing?",
  'Show me your portfolio',
  'How can I apply?'
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => 
    sessionStorage.getItem('chatbot_welcomed') === 'true'
  );
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatbot_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch {
        return [];
      }
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Scroll to bottom when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 100);
    }
  }, [isOpen]);

  // Persist messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatbot_messages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      chatbotService.setToken(currentToken);
    }
  }, []);

  useEffect(() => {
    // Show notification on first login
    if (user && !hasSeenWelcome) {
      setShowNotification(true);
      sessionStorage.setItem('chatbot_welcomed', 'true');
      setHasSeenWelcome(true);
      
      // Auto-hide notification after 8 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [user, hasSeenWelcome]);

  // Smart keyword matching for intent detection
  const detectServiceAndResponse = useCallback((userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase().trim();
    
    // Bye detection with different send-off messages
    if (/\b(bye|goodbye|see you|farewell|take care|see ya|later|cya|adios|ciao)\b/.test(lowerMessage)) {
      const sendOffMessages = [
        "👋 Goodbye! It was great chatting with you. Feel free to come back anytime!",
        "🌟 Take care! Looking forward to our next conversation. Have a wonderful day!",
        "🚀 Until next time! Don't hesitate to reach out when you need creative solutions.",
        "✨ Farewell! Remember, we're always here to help with your creative projects.",
        "💫 See you soon! Thanks for exploring RK Creative Hub with me.",
        "🎨 Goodbye for now! Keep creating amazing things!",
        "🌈 Take care and stay creative! Come back anytime you need inspiration.",
        "⭐ Farewell! Your next creative journey awaits. Safe travels!",
        "🎭 Until we meet again! Keep the creative spark alive.",
        "🎯 Goodbye! Ready to help whenever you're ready to create something amazing."
      ];
      
      const randomMessage = sendOffMessages[Math.floor(Math.random() * sendOffMessages.length)];
      
      return {
        response: randomMessage,
        link: null,
        linkText: null
      };
    }
    
    // Greeting detection
    if (/^(hello|hi|hey|greetings|start|help|what can you do)\b/.test(lowerMessage)) {
      return {
        response: `👋 Hello ${user?.name || 'there'}! I'm SIRA, your AI Assistant at RK Creative Hub. I'm here to help you find the perfect service. What would you like to know?`,
        link: null,
        linkText: null
      };
    }

    // Job seeking / career inquiry - specifically for people wanting to work for us
    if (/work for you|work with you|join your team|join the team|looking for job|seeking job|want to work|apply for job|job application|employment|join company|need to join|join in work|want to join|interested in joining|join your company|i need to join/i.test(lowerMessage)) {
      return {
        response: `That's wonderful! 🎉 We're always excited to welcome talented creative professionals to our team.

We regularly hire for positions in:
• Web Development & Design
• UI/UX Design
• 3D Animation & Motion Graphics
• Branding & Identity Design
• Project Management

Ready to join RK Creative Hub? We'd love to see your portfolio and discuss opportunities!`,
        link: '/apply-employee',
        linkText: 'Apply for a Position'
      };
    }

    // Specific job seeking phrases
    if (/like to work|want to join|interested in working|seeking for job|looking for employment|job seeker/i.test(lowerMessage)) {
      return {
        response: `That's fantastic! 🌟 We're thrilled that you're interested in joining RK Creative Hub.

We believe great work happens when passionate people come together. Our team works on exciting projects across web development, design, branding, and animation.

To apply, you'll need to prepare:
• Your resume/portfolio
• Links to your previous work
• A brief cover letter

Ready to start your journey with us?`,
        link: '/apply-employee',
        linkText: 'Start Your Application'
      };
    }

    // Count keyword matches for each service
    let bestMatch = null;
    let maxMatches = 0;

    try {
      for (const [key, service] of Object.entries(SERVICE_CATEGORIES)) {
        if (!service || !service.keywords) continue;
        
        const matches = service.keywords.filter(keyword => 
          lowerMessage.includes(keyword.toLowerCase())
        ).length;
        
        if (matches > maxMatches) {
          maxMatches = matches;
          bestMatch = service;
        }
      }
    } catch (error) {
      console.error('Error in service matching:', error);
      // Continue with default response
    }

    // Pricing inquiry
    if (/price|cost|how much|pricing|quote|budget/.test(lowerMessage)) {
      return {
        response: `💰 Our pricing varies by project complexity:

🌐 Website Design & Development: ₹5,000 - ₹6,00,000
🎨 Branding & Identity: Custom Pricing
✨ UI/UX Designing: ₹5,000 - ₹50,000 (per Screen)
🎬 3D Animation: ₹2,111 - ₹8,00,000 (per Minute)
📹 Video Editing: ₹5,000 - ₹15,000 (per Hour)
📊 Digital Strategy: ₹10,000 - ₹2,00,000 (per Month)

Would you like a personalized quote?`,
        link: '/services',
        linkText: 'View All Services'
      };
    }

    // Timeline inquiry
    if (/time|how long|duration|timeline|how fast|deadline/.test(lowerMessage)) {
      return {
        response: `⏱️ Project timelines depend on complexity:
        
📌 Small Projects: 1-2 weeks
📌 Medium Projects: 2-4 weeks
📌 Large Projects: 4-8+ weeks

Let's discuss your specific timeline needs!`,
        link: '/services',
        linkText: 'Discuss Timeline'
      };
    }

    // Contact inquiry
    if (/contact|call|reach|email|phone|get in touch/.test(lowerMessage)) {
      return {
        response: `📞 You can reach us:

📧 Email: rajkayal7281@gmail.com
📱 Phone: Available during business hours
💬 Chat: You're already here!
📋 Contact Form: Available on our contact page

How can we assist you?`,
        link: '/contact',
        linkText: 'Contact Us'
      };
    }

    // Service detected with keywords matched
    if (bestMatch && maxMatches > 0) {
      return {
        response: `Perfect! You're looking for ${bestMatch.name}. 

${bestMatch.name === 'Web Development' ? '🌐 We build fast, scalable, and beautiful web applications and responsive websites tailored to your needs.' :
bestMatch.name === 'Branding & Identity' ? '🎨 We create complete branding solutions including logos, brand guidelines, and visual identities.' :
bestMatch.name === 'UI/UX Design' ? '✨ We design beautiful and intuitive user interfaces with exceptional user experiences.' :
bestMatch.name === '3D Animation' ? '🎬 We produce professional 3D animations, motion graphics, and visual effects.' :
bestMatch.name === 'All Services' ? '🌟 We offer a complete suite of creative services. Let me show you everything we can do!' :
bestMatch.name === 'Portfolio' ? '📁 Check out our impressive portfolio of completed projects!' :
bestMatch.name === 'Career' ? '🚀 Join our talented creative team!' :
'📚 Read our latest insights and articles!'}

Let me show you more details!`,
        link: bestMatch.link,
        linkText: `View ${bestMatch.name}`
      };
    }

    // Default response showing all options
    return {
      response: `🌟 Here's what we offer:

🌐 Web Development - Custom web apps & responsive websites
🎨 Branding & Identity - Complete brand design
✨ UI/UX Design - Beautiful, intuitive interfaces
🎬 3D Animation - Professional animations & effects
📁 Portfolio - See our previous work
🚀 Career - Join our creative team
📚 Blog - Industry insights

Are you looking for our services, or interested in joining our team?`,
      link: '/services',
      linkText: 'View All Services'
    };
  }, [user?.name]);

  const handleOpenChat = useCallback(() => {
    setIsOpen(true);
    setShowNotification(false);
    
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        text: `Hi ${user?.name || 'there'}! 🌟 I'm SIRA, your friendly AI assistant. How can I help you discover our creative services today?`,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [messages.length, user?.name]);

  const handleSendMessage = useCallback(async (text?: string) => {
    const messageText = (text || inputValue).trim();
    if (!messageText) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get smart response with intent detection
      const { response, link, linkText } = detectServiceAndResponse(messageText);
      console.log('Detected response:', { response, link, linkText });
      
      // Check if this is a bye message to auto-close chat
      const isByeMessage = /\b(bye|goodbye|see you|farewell|take care|see ya|later|cya|adios|ciao)\b/.test(messageText.toLowerCase());
      
      let botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        suggestedLink: link,
        suggestedLinkText: linkText
      };

      // If user is not authenticated, add login suggestion to response
      if (!user) {
        botMsg.text = `${response}\n\n✨ **Want personalized recommendations and to place orders?** Sign in to unlock full features!`;
        botMsg.suggestedLink = '/login';
        botMsg.suggestedLinkText = '🔐 Sign In / Create Account';
      }
      
      // Send to backend if authenticated
      if (user && user.id && user.email) {
        try {
          const apiResponse = await chatbotService.sendMessage(
            user.id,
            user.name || user.email,
            user.email,
            messageText,
            sessionId,
            'general'
          );
          
          // Use API response if available and valid
          if (apiResponse?.botMessage) {
            botMsg = {
              id: (Date.now() + 1).toString(),
              text: apiResponse.botMessage.message || response,
              sender: 'bot',
              timestamp: new Date(),
              suggestedLink: apiResponse.suggestedLink || link,
              suggestedLinkText: apiResponse.suggestedLinkText || linkText
            };
          }
          console.log('API Bot Message:', botMsg);
        } catch (apiError) {
          // Fallback to client-side response if API fails
          console.warn('API error, using fallback response:', apiError);
        }
      }
      
      setMessages(prev => [...prev, botMsg]);
      
      // Auto-close chat after bye message with delay
      if (isByeMessage) {
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, user, sessionId, detectServiceAndResponse]);

  const handleQuestionClick = useCallback((question: string) => {
    handleSendMessage(question);
  }, [handleSendMessage]);

  const handleLinkClick = useCallback((link: string) => {
    console.log('Navigating to:', link);
    navigate(link);
    setIsOpen(false);
  }, [navigate]);

  const handleCloseChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleDismissNotification = useCallback(() => {
    setShowNotification(false);
  }, []);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleOpenChat}
            className="group relative w-14 h-14 bg-gradient-to-br from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
            aria-label="Open SIRA AI Assistant"
            title="Open SIRA AI Assistant"
          >
            <Bot size={28} className="transition-transform group-hover:rotate-12" />
            
            {/* Red Glow Notification Dot */}
            {showNotification && (
              <>
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50 ring-2 ring-accent"></span>
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></span>
              </>
            )}
          </button>

          {/* Welcome Notification Popup */}
          {showNotification && (
            <div className="absolute bottom-20 right-0 animate-in slide-in-from-bottom-2 duration-300 sm:w-80 w-72">
              <div className="bg-card border border-accent/30 rounded-xl shadow-2xl p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <MessageCircle className="w-5 h-5 text-accent animate-bounce" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-sm">Welcome {user?.name || 'back'}! 👋</p>
                    <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                      SIRA is here to help you explore our services. Click to start chatting!
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={handleOpenChat}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Chat Now
                  </button>
                  <button
                    onClick={handleDismissNotification}
                    className="px-3 py-1.5 hover:bg-muted rounded-lg text-xs font-semibold transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 w-full h-full sm:w-96 sm:h-[600px] bg-card rounded-none sm:rounded-2xl shadow-2xl flex flex-col z-50 border-t sm:border border-border/40 backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-accent via-accent/90 to-primary/20 text-accent-foreground p-4 sm:p-6 flex justify-between items-center relative flex-shrink-0">
            <div className="flex-1">
              <h3 className="font-bold text-base sm:text-lg">SIRA AI Assistant</h3>
              <p className="text-xs text-accent-foreground/70 mt-0.5">Always here to help</p>
            </div>
            <button
              onClick={handleCloseChat}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors flex-shrink-0 ml-2"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 sm:space-y-4 bg-gradient-to-b from-background to-background/50">
            {messages.length === 0 ? (
              <>
                {/* Welcome Message */}
                <div className="flex justify-start">
                  <div className="bg-accent/10 text-foreground px-4 py-3 rounded-2xl rounded-tl-none max-w-xs sm:max-w-sm border border-accent/20 text-sm sm:text-base">
                    {user ? (
                      <>
                        <p className="font-medium">Welcome {user?.name || 'there'}! 🌟 I'm SIRA</p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                          I'm your personal AI assistant at RK Creative Hub. I'm here to help you discover our amazing services, answer your questions, and guide you through the perfect creative solution for your needs.
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed font-medium">
                          Ready to explore? Ask me anything or try the quick questions below! 🚀
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">👋 Welcome to SIRA - AI Assistant</p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                          I'm your AI assistant at RK Creative Hub! I'm here to help you explore our amazing services and answer your questions.
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed font-medium text-accent">
                          🔐 To send messages and unlock full features, please sign in or create an account. It's quick and free!
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Questions - Visible to all users */}
                <div className="flex flex-col gap-2 mt-4 sm:mt-6">
                  <p className="text-xs text-muted-foreground font-semibold px-1">Quick questions:</p>
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQuestionClick(q)}
                      disabled={isLoading}
                      className="text-left text-xs sm:text-sm bg-muted/50 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-foreground px-3 py-2.5 rounded-lg transition-all duration-200 border border-border/30 hover:border-accent/50 hover:shadow-md active:scale-95"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Sign In Prompt - Optional helper for non-logged in users */}
                {!user && (
                <div className="flex justify-center mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-xs text-muted-foreground text-center">
                    💡 <span className="font-medium">Tip:</span> Sign in to place orders and get personalized help!
                  </p>
                </div>
                )}
              </>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl text-sm break-words ${
                      msg.sender === 'user'
                        ? 'bg-accent text-accent-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-tl-none border border-border/30'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.suggestedLink && msg.suggestedLinkText && msg.sender === 'bot' && (
                      <button
                        onClick={() => handleLinkClick(msg.suggestedLink!)}
                        className="mt-2.5 w-full flex items-center justify-center gap-1.5 bg-accent hover:bg-accent/90 text-accent-foreground px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-md active:scale-95"
                      >
                        {msg.suggestedLinkText}
                        <ExternalLink size={12} />
                      </button>
                    )}
                    <p className={`text-xs mt-1.5 ${msg.sender === 'user' ? 'text-accent-foreground/70' : 'text-muted-foreground/70'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground px-4 py-3 rounded-2xl rounded-tl-none border border-border/30 flex items-center gap-2">
                  <Loader size={16} className="animate-spin" />
                  <span className="text-xs sm:text-sm">Typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} className="h-0" />
          </div>

          {/* Input Area */}
          <div className="border-t border-border/40 p-4 bg-card/50 backdrop-blur-sm flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 border border-border/50 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 bg-background text-foreground text-sm placeholder-muted-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim()}
                className="bg-accent hover:bg-accent/90 disabled:bg-muted text-accent-foreground disabled:text-muted-foreground p-2.5 rounded-xl transition-all duration-200 hover:shadow-lg disabled:shadow-none flex-shrink-0"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
