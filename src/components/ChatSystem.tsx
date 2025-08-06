import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Phone, Video, MoreVertical, X } from 'lucide-react';
import { Message, Conversation } from '../types';

interface ChatSystemProps {
  conversation: Conversation;
  currentUserId: string;
  onClose: () => void;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ conversation, currentUserId, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages for demonstration
  const mockMessages: Message[] = [
    {
      id: '1',
      conversationId: conversation.id,
      senderId: 'sitter1',
      content: 'Здравейте! Благодаря ви за интереса към моите услуги. Бих се радвала да се грижа за вашия домашен любимец.',
      timestamp: new Date('2024-01-15T10:00:00'),
      read: true,
      type: 'text',
    },
    {
      id: '2',
      conversationId: conversation.id,
      senderId: currentUserId,
      content: 'Здравейте! Имам куче - голдън ретрийвър на 3 години. Търся някой за ежедневни разходки.',
      timestamp: new Date('2024-01-15T10:05:00'),
      read: true,
      type: 'text',
    },
    {
      id: '3',
      conversationId: conversation.id,
      senderId: 'sitter1',
      content: 'Прекрасно! Обожавам голдън ретрийвърите. Колко дълги разходки предпочитате и в кое време от деня?',
      timestamp: new Date('2024-01-15T10:10:00'),
      read: true,
      type: 'text',
    },
    {
      id: '4',
      conversationId: conversation.id,
      senderId: currentUserId,
      content: 'Около 45 минути до 1 час, предпочитам сутрин между 8:00 и 10:00. Макс е много енергичен и обича да си играе.',
      timestamp: new Date('2024-01-15T10:15:00'),
      read: true,
      type: 'text',
    },
  ];

  useEffect(() => {
    setMessages(mockMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      conversationId: conversation.id,
      senderId: currentUserId,
      content: newMessage,
      timestamp: new Date(),
      read: false,
      type: 'text',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setLoading(true);

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        conversationId: conversation.id,
        senderId: 'sitter1',
        content: 'Благодаря за информацията! Звучи чудесно. Бихте ли искали да се срещнем първо за запознаване?',
        timestamp: new Date(),
        read: false,
        type: 'text',
      };
      setMessages(prev => [...prev, response]);
      setLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('bg-BG', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Днес';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('bg-BG');
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg"
            alt="Мария Петкова"
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <h3 className="font-semibold text-gray-900">Мария Петкова</h3>
            <p className="text-sm text-green-600">Онлайн</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <Phone className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <Video className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <MoreVertical className="h-5 w-5" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUserId;
          const showDate = index === 0 || 
            formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);

          return (
            <div key={message.id}>
              {showDate && (
                <div className="text-center text-sm text-gray-500 my-4">
                  {formatDate(message.timestamp)}
                </div>
              )}
              
              <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isCurrentUser 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isCurrentUser ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end space-x-2">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <Paperclip className="h-5 w-5" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишете съобщение..."
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:ring-green-500 focus:border-green-500 resize-none"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;