import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Bot, Brain, Send, Sun, User, Wind } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Define message types
type Message = {
  id: number;
  sender: 'user' | 'ai';
  text?: string;
  component?: React.ReactNode;
};

// Example AI response component with disclaimer
const AIResponseWithDisclaimer = ({ children }: { children: React.ReactNode }) => (
  <div>
    {children}
    <div className="mt-4 pt-2 border-t border-foreground/20 text-xs text-muted-foreground">
      This information is for educational purposes and is not a substitute for professional medical advice. Please consult with your healthcare provider before using any herbal products.
    </div>
  </div>
);

const AIAssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I am your Ayur-Companion. How can I help you on your wellness journey today?",
    },
    // Example conversation flow from the mockup
    {
      id: 2,
      sender: 'user',
      text: "Recommend an herb for 'calm'",
    },
    {
      id: 3,
      sender: 'ai',
      component: (
        <AIResponseWithDisclaimer>
          <p className="mb-4">Of course. For promoting a sense of calm, many find Ashwagandha to be a supportive herb.</p>
          <div className="bg-background/50 rounded-lg p-4 border border-border">
            <h4 className="font-wisdom font-semibold">Ashwagandha (Withania somnifera)</h4>
            <p className="text-sm text-muted-foreground mt-1">An ancient adaptogenic herb revered for its ability to reduce stress and improve vitality.</p>
            <Link to="/herb-portal/ashwagandha" className="text-sm text-primary font-semibold mt-2 inline-block hover:underline">
              Read the full profile...
            </Link>
          </div>
        </AIResponseWithDisclaimer>
      ),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const conversationStarters = [
    { icon: Sun, text: "Suggest a recipe for energy" },
    { icon: Wind, text: "Recommend an herb for 'calm'" },
    { icon: Brain, text: "What helps with focus?" },
  ];

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { id: Date.now(), sender: 'user', text: inputValue }]);
      setInputValue('');
      // Here you would typically call your AI service
    }
  };

  return (
    <div className="bg-background h-screen font-modern flex flex-col">
      <header className="py-8 text-center">
        <h1 className="text-5xl md:text-6xl font-wisdom font-bold text-foreground">Ayur-Companion</h1>
        <p className="text-lg text-primary mt-2">Your Personal AI Herbalist</p>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-8">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              )}
              <div className={`max-w-xl rounded-2xl px-5 py-4 shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-br-none' 
                  : 'bg-muted text-foreground rounded-bl-none'
              }`}>
                {msg.text || msg.component}
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Input Area and Conversation Starters */}
      <div className="w-full max-w-3xl mx-auto px-4 pb-4">
          {/* Render conversation starters if it's a new chat */}
          {messages.length === 1 && (
            <div className="mb-4 text-center animate-fade-in-up pb-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {conversationStarters.map(starter => (
                  <button 
                    key={starter.text} 
                    className="p-4 bg-muted rounded-xl hover:bg-primary/10 transition-colors text-left group"
                    onClick={() => setInputValue(starter.text)}
                  >
                    <starter.icon className="w-5 h-5 mb-2 text-primary" />
                    <p className="text-sm font-medium text-foreground">{starter.text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Input Form */}
        <div className="py-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask about herbs, recipes, or products..."
              className="w-full pl-6 pr-16 py-7 text-base rounded-full bg-muted border-muted-foreground/20 border-2 focus-visible:ring-primary/50 focus-visible:ring-4"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button size="icon" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full w-10 h-10" onClick={handleSendMessage} disabled={!inputValue.trim()}>
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      {/* Back to Home Link */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  );
};

export default AIAssistantPage;