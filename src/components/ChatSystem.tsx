import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Phone, Video, MoreVertical, X, AlertTriangle } from 'lucide-react';
import { Message, Conversation } from '../types';
import { filterChatMessage, getUserChatStatus } from '../lib/chatFilter';

interface ChatSystemProps {
  conversation: Conversation;
  currentUserId: string;
  onClose: () => void;
  bookingStatus?: string;
  paymentStatus?: string;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ conversation, currentUserId, onClose, bookingStatus, paymentStatus }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatStatus, setChatStatus] = useState({ canSend: true, isReadOnly: false, isBanned: false });
  const [filterWarning, setFilterWarning] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isPaymentComplete = bookingStatus === 'confirmed' && (paymentStatus === 'completed' || paymentStatus === 'paid');

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
    loadChatStatus();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatStatus = async () => {
    const status = await getUserChatStatus(currentUserId);
    setChatStatus(status);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (chatStatus.isBanned) {
      setFilterWarning('You are temporarily banned from sending messages.');
      return;
    }

    if (chatStatus.isReadOnly) {
      setFilterWarning('You can only read messages due to previous violations.');
      return;
    }

    const filterResult = await filterChatMessage(currentUserId, newMessage);

    if (filterResult.isBlocked) {
      setFilterWarning(filterResult.reason || 'Message blocked');
      await loadChatStatus();
      setTimeout(() => setFilterWarning(null), 5000);
      return;
    }

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

  if (!isPaymentComplete) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 shadow-2xl border-2 border-orange-200">
          <div className="flex flex-col items-center text-center">
            <div className="bg-orange-100 p-4 rounded-full mb-4">
              <AlertTriangle className="h-12 w-12 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Чатът не е достъпен
            </h3>
            <p className="text-gray-700 mb-6">
              Чатът ще бъде активиран след успешно заплащане на резервацията.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
            >
              Разбрах
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Filter Warning */}
      {filterWarning && (
        <div className="bg-red-50 border-t border-red-200 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-semibold">Message Blocked</p>
              <p className="text-sm text-red-700">{filterWarning}</p>
            </div>
          </div>
        </div>
      )}

      {/* Ban Notice */}
      {chatStatus.isBanned && (
        <div className="bg-red-100 border-t border-red-300 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-900 font-bold">Account Temporarily Banned</p>
              <p className="text-sm text-red-800">You cannot send messages due to multiple violations. Ban expires in 48 hours.</p>
            </div>
          </div>
        </div>
      )}

      {/* Read Only Notice */}
      {chatStatus.isReadOnly && !chatStatus.isBanned && (
        <div className="bg-yellow-50 border-t border-yellow-200 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-yellow-900 font-semibold">Read-Only Mode</p>
              <p className="text-sm text-yellow-800">You can only read messages due to a previous violation.</p>
            </div>
          </div>
        </div>
      )}

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
              placeholder={chatStatus.canSend ? "Напишете съобщение..." : "You cannot send messages"}
              disabled={!chatStatus.canSend || chatStatus.isBanned}
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:ring-green-500 focus:border-green-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !chatStatus.canSend || chatStatus.isBanned}
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