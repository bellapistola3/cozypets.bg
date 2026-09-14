import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Phone, Video, MoreVertical, X, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { chatService, ChatApprovalStatus } from '../lib/chatService';
import { filterChatMessage, getUserChatStatus } from '../lib/chatFilter';

interface ChatSystemProps {
  reservationId: string;
  currentUserId: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  onClose: () => void;
}

const ChatSystem: React.FC<ChatSystemProps> = ({
  reservationId,
  currentUserId,
  receiverId,
  receiverName,
  receiverAvatar,
  onClose,
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatStatus, setChatStatus] = useState({ canSend: true, isReadOnly: false, isBanned: false });
  const [approvalStatus, setApprovalStatus] = useState<ChatApprovalStatus | null>(null);
  const [filterWarning, setFilterWarning] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    loadChatStatus();

    const subscription = chatService.subscribeToMessages(reservationId, (newMsg) => {
      loadMessages();
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [reservationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      chatService.markMessagesAsRead(reservationId, currentUserId);
    }
  }, [messages]);

  const loadMessages = async () => {
    const result = await chatService.getMessages(reservationId, currentUserId);
    if (result.data) {
      setMessages(result.data);
    }
    if (result.approvalStatus) {
      setApprovalStatus(result.approvalStatus);
    }
  };

  const loadChatStatus = async () => {
    const status = await getUserChatStatus(currentUserId);
    setChatStatus(status);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!approvalStatus?.canChat) {
      setFilterWarning('Чатът не е одобрен. Моля, изчакайте одобрение от администратор.');
      setTimeout(() => setFilterWarning(null), 5000);
      return;
    }

    if (chatStatus.isBanned) {
      setFilterWarning('Временно сте забранени да изпращате съобщения.');
      return;
    }

    if (chatStatus.isReadOnly) {
      setFilterWarning('Можете само да четете съобщения поради предишни нарушения.');
      return;
    }

    const filterResult = await filterChatMessage(currentUserId, newMessage);

    if (filterResult.isBlocked) {
      setFilterWarning(filterResult.reason || 'Съобщението е блокирано');
      await loadChatStatus();
      setTimeout(() => setFilterWarning(null), 5000);
      return;
    }

    setLoading(true);

    const result = await chatService.sendMessage(
      reservationId,
      currentUserId,
      receiverId,
      newMessage,
      'text'
    );

    if (result.success && result.data) {
      setMessages((prev) => [...prev, result.data]);
      setNewMessage('');
    } else {
      setFilterWarning(result.error || 'Грешка при изпращане на съобщението.');
      setTimeout(() => setFilterWarning(null), 5000);
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('bg-BG', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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

  if (!approvalStatus?.canChat) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 shadow-2xl border-2 border-orange-200">
          <div className="flex flex-col items-center text-center">
            <div className="bg-orange-100 p-4 rounded-full mb-4">
              {approvalStatus?.requestStatus === 'pending' ? (
                <Clock className="h-12 w-12 text-orange-600" />
              ) : approvalStatus?.requestStatus === 'rejected' ? (
                <X className="h-12 w-12 text-red-600" />
              ) : (
                <AlertTriangle className="h-12 w-12 text-orange-600" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {approvalStatus?.requestStatus === 'pending'
                ? 'Чат в процес на одобрение'
                : approvalStatus?.requestStatus === 'rejected'
                ? 'Чат заявка отказана'
                : 'Чатът не е достъпен'}
            </h3>
            <p className="text-gray-700 mb-6">
              {approvalStatus?.message ||
                'Чатът ще бъде активиран след одобрение от администратор.'}
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
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={
              receiverAvatar ||
              'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg'
            }
            alt={receiverName}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{receiverName}</h3>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <p className="text-sm text-green-600">Чат одобрен</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => {
          const isCurrentUser = message.sender_id === currentUserId;
          const showDate =
            index === 0 ||
            formatDate(message.created_at) !== formatDate(messages[index - 1].created_at);

          return (
            <div key={message.id}>
              {showDate && (
                <div className="text-center text-sm text-gray-500 my-4">
                  {formatDate(message.created_at)}
                </div>
              )}

              <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    isCurrentUser
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-900 shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isCurrentUser ? 'text-green-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {filterWarning && (
        <div className="bg-red-50 border-t border-red-200 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-semibold">Съобщение блокирано</p>
              <p className="text-sm text-red-700">{filterWarning}</p>
            </div>
          </div>
        </div>
      )}

      {chatStatus.isBanned && (
        <div className="bg-red-100 border-t border-red-300 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-900 font-bold">Акаунтът е временно забранен</p>
              <p className="text-sm text-red-800">
                Не можете да изпращате съобщения поради множество нарушения. Забраната изтича след
                48 часа.
              </p>
            </div>
          </div>
        </div>
      )}

      {chatStatus.isReadOnly && !chatStatus.isBanned && (
        <div className="bg-yellow-50 border-t border-yellow-200 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-yellow-900 font-semibold">Режим само четене</p>
              <p className="text-sm text-yellow-800">
                Можете само да четете съобщения поради предишно нарушение.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                chatStatus.canSend ? 'Напишете съобщение...' : 'Не можете да изпращате съобщения'
              }
              disabled={!chatStatus.canSend || chatStatus.isBanned || loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:ring-green-500 focus:border-green-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !chatStatus.canSend || chatStatus.isBanned || loading}
            className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;
