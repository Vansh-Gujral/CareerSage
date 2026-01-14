import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatIcon } from './icons/ChatIcon';
import { CloseIcon } from './icons/CloseIcon';
import { SendIcon } from './icons/SendIcon';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Hello! I'm Career Sage, your personal career advisor. How can I help you plan your professional journey today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(input);
      const modelMessage: Message = { role: 'model', content: response };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: Message = { role: 'model', content: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform duration-200 ease-in-out hover:scale-110 z-50"
        aria-label="Open chat"
      >
        <ChatIcon />
      </button>

      <div
        className={`fixed bottom-24 right-6 w-full max-w-md h-[70vh] flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 transition-all duration-300 ease-in-out z-50 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <header className="flex items-center justify-between p-4 bg-indigo-600 text-white rounded-t-2xl shadow-md">
          <h3 className="text-lg font-bold">Career Sage Advisor</h3>
          <button onClick={toggleChat} className="p-1 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white">
            <CloseIcon />
          </button>
        </header>

        <main className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-slate-900">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {/* FIX: Removed a stray single quote in the className of the following div that was causing a syntax error. */}
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-indigo-500 text-white rounded-br-none'
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-2xl rounded-bl-none p-4">
                      <div className="flex items-center space-x-2">
                        <span className="h-2 w-2 bg-gray-500 dark:bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-gray-500 dark:bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-gray-500 dark:bg-slate-400 rounded-full animate-pulse"></span>
                      </div>
                  </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </main>

        <footer className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-2xl">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your career..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Chatbot;