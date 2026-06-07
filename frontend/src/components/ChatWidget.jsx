import React, { useState, useEffect, useRef } from 'react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your ImmersiveEstates assistant. To get started, what's your full name?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [leadId, setLeadId] = useState(null);
  const [sessionData, setSessionData] = useState({ step: 'collecting_name' });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: leadId,
          message: userMessage,
          session_data: sessionData
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        setSessionData(data.session_data);
        setLeadId(data.lead_id);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#B8966A] text-[#0E0E0E] rounded-full p-5 shadow-2xl hover:bg-[#D4B68A] transition-all transform hover:scale-110 active:scale-95 group"
        >
          <svg className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-4 border-[#0E0E0E] animate-pulse"></div>
        </button>
      ) : (
        <div className="bg-[#171714] rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] w-80 sm:w-[400px] flex flex-col overflow-hidden border border-[#B8966A]/20 h-[600px] transform origin-bottom-right animate-in fade-in zoom-in duration-300">
          <div className="bg-[#171714] p-6 text-[#F2EDE4] flex justify-between items-center border-b border-[#B8966A]/10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#B8966A] rounded-2xl flex items-center justify-center text-[#0E0E0E] font-black shadow-xl">IE</div>
              <div>
                <p className="font-black text-sm uppercase tracking-widest">Assistant</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">System Active</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[#F2EDE4]/40 hover:text-[#B8966A] transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto bg-[#0E0E0E] space-y-6 scrollbar-hide">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#B8966A] text-[#0E0E0E] font-bold shadow-lg' 
                    : 'bg-[#171714] text-[#F2EDE4] border border-[#B8966A]/10 shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#171714] text-[#B8966A] border border-[#B8966A]/10 p-4 rounded-2xl shadow-sm text-xs font-black uppercase tracking-widest animate-pulse">
                  Processing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-6 bg-[#171714] border-t border-[#B8966A]/10 flex space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-[#0E0E0E] border border-[#B8966A]/20 rounded-xl px-4 py-3 text-sm text-[#F2EDE4] focus:border-[#B8966A] outline-none transition"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="bg-[#B8966A] text-[#0E0E0E] p-3 rounded-xl hover:bg-[#D4B68A] disabled:opacity-50 transition shadow-xl"
              disabled={isLoading || !inputValue.trim()}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
