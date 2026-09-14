import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Stethoscope } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface Message {
    id: string;
    sender: 'user' | 'vet';
    text: string;
    timestamp: Date;
}

const VetChatWidget: React.FC = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && user) {
            loadMessages();
        }
    }, [isOpen, user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadMessages = async () => {
        try {
            const { data } = await supabase
                .from('vet_chat_messages')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: true });

            if (data) {
                setMessages(
                    data.map((msg: any) => ({
                        id: msg.id,
                        sender: msg.sender_type,
                        text: msg.message,
                        timestamp: new Date(msg.created_at),
                    }))
                );
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!inputText.trim() || !user) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputText,
            timestamp: new Date(),
        };

        setMessages([...messages, newMessage]);
        setInputText('');
        setLoading(true);

        try {
            // Save message to database
            await supabase.from('vet_chat_messages').insert({
                user_id: user.id,
                sender_type: 'user',
                message: inputText,
            });

            // Simulate vet response (in real app, this would be real-time)
            setTimeout(() => {
                const vetResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'vet',
                    text: 'Благодаря за вашето съобщение! Ветеринарът ще отговори скоро. Моля опишете проблема по-подробно.',
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, vetResponse]);
                setLoading(false);
            }, 1500);
        } catch (error) {
            console.error('Error sending message:', error);
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <>
            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all z-50 flex items-center gap-2"
            >
                <Stethoscope className="h-6 w-6" />
                {!isOpen && <span className="pr-2">Ветеринар</span>}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Stethoscope className="h-5 w-5" />
                            <h3 className="font-semibold">Чат с ветеринар</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-1 rounded"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 mt-8">
                                <Stethoscope className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                                <p>Здравейте! Как мога да ви помогна?</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.sender === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white text-gray-900 shadow'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.text}</p>
                                        <p
                                            className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                                                }`}
                                        >
                                            {msg.timestamp.toLocaleTimeString('bg-BG', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-2xl px-4 py-2 shadow">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: '0.2s' }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: '0.4s' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Напишете съобщение..."
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputText.trim() || loading}
                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default VetChatWidget;
