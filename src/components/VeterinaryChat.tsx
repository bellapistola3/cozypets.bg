import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Paperclip,
  X,
  User,
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  Phone,
  Video,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import Button from './common/Button';

interface VetChatMessage {
  id: string;
  chat_room_id: string;
  sender_id: string;
  sender_type: 'user' | 'veterinarian';
  message: string;
  message_type: 'text' | 'image' | 'file';
  file_url?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

interface VetChatRoom {
  id: string;
  user_id: string;
  veterinarian_id?: string;
  pet_id?: string;
  subject: string;
  urgency_level: 'low' | 'normal' | 'high' | 'emergency';
  status: 'open' | 'waiting' | 'in_progress' | 'closed';
  started_at: string;
  closed_at?: string;
}

interface Veterinarian {
  id: string;
  profile_id: string;
  full_name: string;
  avatar_url?: string;
  specialization: string;
  is_online: boolean;
  is_available: boolean;
  rating: number;
  years_of_experience: number;
}

const VeterinaryChat: React.FC = () => {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<VetChatRoom[]>([]);
  const [activeChatRoom, setActiveChatRoom] = useState<VetChatRoom | null>(null);
  const [messages, setMessages] = useState<VetChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [newChatForm, setNewChatForm] = useState({
    subject: '',
    urgency_level: 'normal' as 'low' | 'normal' | 'high' | 'emergency',
    pet_id: '',
    initial_message: '',
  });

  useEffect(() => {
    if (user) {
      loadChatRooms();
      loadVeterinarians();
    }
  }, [user]);

  useEffect(() => {
    if (activeChatRoom) {
      loadMessages(activeChatRoom.id);
      subscribeToMessages(activeChatRoom.id);
    }
  }, [activeChatRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatRooms = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('vet_chat_rooms')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Error loading chat rooms:', error);
      return;
    }

    setChatRooms(data || []);
  };

  const loadVeterinarians = async () => {
    const { data, error } = await supabase
      .from('veterinarians')
      .select(`
        *,
        profiles:profile_id (
          full_name,
          avatar_url
        )
      `)
      .eq('is_available', true);

    if (error) {
      console.error('Error loading veterinarians:', error);
      return;
    }

    const vets = data?.map((vet: any) => ({
      id: vet.id,
      profile_id: vet.profile_id,
      full_name: vet.profiles?.full_name || 'Unknown',
      avatar_url: vet.profiles?.avatar_url,
      specialization: vet.specialization,
      is_online: vet.is_online,
      is_available: vet.is_available,
      rating: vet.rating,
      years_of_experience: vet.years_of_experience,
    }));

    setVeterinarians(vets || []);
  };

  const loadMessages = async (chatRoomId: string) => {
    const { data, error } = await supabase
      .from('vet_chat_messages')
      .select('*')
      .eq('chat_room_id', chatRoomId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    setMessages(data || []);
    markMessagesAsRead(chatRoomId);
  };

  const markMessagesAsRead = async (chatRoomId: string) => {
    if (!user) return;

    await supabase
      .from('vet_chat_messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('chat_room_id', chatRoomId)
      .neq('sender_id', user.id)
      .eq('is_read', false);
  };

  const subscribeToMessages = (chatRoomId: string) => {
    const channel = supabase
      .channel(`vet_chat_messages:${chatRoomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vet_chat_messages',
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as VetChatMessage]);
          markMessagesAsRead(chatRoomId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createNewChat = async () => {
    if (!user || !newChatForm.subject || !newChatForm.initial_message) {
      return;
    }

    setLoading(true);

    const { data: chatRoom, error: chatError } = await supabase
      .from('vet_chat_rooms')
      .insert({
        user_id: user.id,
        subject: newChatForm.subject,
        urgency_level: newChatForm.urgency_level,
        pet_id: newChatForm.pet_id || null,
      })
      .select()
      .single();

    if (chatError) {
      console.error('Error creating chat room:', chatError);
      setLoading(false);
      return;
    }

    const { error: messageError } = await supabase
      .from('vet_chat_messages')
      .insert({
        chat_room_id: chatRoom.id,
        sender_id: user.id,
        sender_type: 'user',
        message: newChatForm.initial_message,
        message_type: 'text',
      });

    if (messageError) {
      console.error('Error sending initial message:', messageError);
    }

    setLoading(false);
    setShowNewChatModal(false);
    setNewChatForm({
      subject: '',
      urgency_level: 'normal',
      pet_id: '',
      initial_message: '',
    });

    loadChatRooms();
    setActiveChatRoom(chatRoom);
  };

  const sendMessage = async () => {
    if (!user || !activeChatRoom || !newMessage.trim()) return;

    const { error } = await supabase.from('vet_chat_messages').insert({
      chat_room_id: activeChatRoom.id,
      sender_id: user.id,
      sender_type: 'user',
      message: newMessage,
      message_type: 'text',
    });

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    if (activeChatRoom.status === 'waiting') {
      await supabase
        .from('vet_chat_rooms')
        .update({ status: 'in_progress' })
        .eq('id', activeChatRoom.id);
    }

    setNewMessage('');
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-blue-100 text-blue-700';
      case 'normal':
        return 'bg-green-100 text-green-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'emergency':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getUrgencyLabel = (level: string) => {
    switch (level) {
      case 'low':
        return 'Ниска';
      case 'normal':
        return 'Нормална';
      case 'high':
        return 'Висока';
      case 'emergency':
        return 'Спешна';
      default:
        return level;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Отворен';
      case 'waiting':
        return 'Чакане';
      case 'in_progress':
        return 'В процес';
      case 'closed':
        return 'Затворен';
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <MessageCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Моля, влезте в профила си
          </h2>
          <p className="text-gray-600 mb-6">
            За да използвате ветеринарния чат, трябва да влезете в профила си.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Върни се към началната страница
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ветеринарен чат</h1>
            <p className="text-gray-600 mt-1">
              Свържете се с ветеринарен лекар за консултация
            </p>
          </div>
          <Button onClick={() => setShowNewChatModal(true)}>
            <MessageCircle className="h-5 w-5 mr-2" />
            Нова консултация
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-green-50">
              <h2 className="font-semibold text-gray-900">Моите консултации</h2>
            </div>

            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {chatRooms.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>Все още нямате консултации</p>
                  <p className="text-sm mt-1">Започнете нова консултация с ветеринар</p>
                </div>
              ) : (
                chatRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setActiveChatRoom(room)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      activeChatRoom?.id === room.id ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 line-clamp-1">{room.subject}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(
                          room.urgency_level
                        )}`}
                      >
                        {getUrgencyLabel(room.urgency_level)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(room.started_at).toLocaleDateString('bg-BG')}
                      </span>
                      <span className="text-xs">{getStatusLabel(room.status)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[700px]">
            {activeChatRoom ? (
              <>
                <div className="p-4 border-b border-gray-200 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-gray-900">{activeChatRoom.subject}</h2>
                      <p className="text-sm text-gray-600">
                        Статус: {getStatusLabel(activeChatRoom.status)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                        <Phone className="h-5 w-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                        <Video className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => {
                    const isOwn = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            isOwn
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          } rounded-2xl px-4 py-2`}
                        >
                          {msg.message_type === 'text' ? (
                            <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                          ) : msg.message_type === 'image' ? (
                            <img
                              src={msg.file_url}
                              alt="Attached"
                              className="rounded-lg max-w-full"
                            />
                          ) : null}
                          <p
                            className={`text-xs mt-1 ${
                              isOwn ? 'text-green-100' : 'text-gray-500'
                            }`}
                          >
                            {new Date(msg.created_at).toLocaleTimeString('bg-BG', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {isOwn && msg.is_read && (
                              <CheckCircle2 className="inline h-3 w-3 ml-1" />
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Paperclip className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <ImageIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Напишете съобщение..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Изберете консултация</p>
                  <p className="text-sm mt-1">
                    Изберете консултация от списъка или започнете нова
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {showNewChatModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Нова консултация</h2>
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тема на консултацията
                  </label>
                  <input
                    type="text"
                    value={newChatForm.subject}
                    onChange={(e) =>
                      setNewChatForm({ ...newChatForm, subject: e.target.value })
                    }
                    placeholder="Например: Консултация за храносмилане"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Спешност
                  </label>
                  <select
                    value={newChatForm.urgency_level}
                    onChange={(e) =>
                      setNewChatForm({
                        ...newChatForm,
                        urgency_level: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="low">Ниска</option>
                    <option value="normal">Нормална</option>
                    <option value="high">Висока</option>
                    <option value="emergency">Спешна</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Опишете проблема
                  </label>
                  <textarea
                    value={newChatForm.initial_message}
                    onChange={(e) =>
                      setNewChatForm({ ...newChatForm, initial_message: e.target.value })
                    }
                    placeholder="Опишете подробно проблема с вашия домашен любимец..."
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {veterinarians.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-900 mb-1">
                          Налични ветеринари: {veterinarians.length}
                        </h3>
                        <p className="text-sm text-blue-700">
                          Ще бъдете свързани автоматично с наличен ветеринарен лекар.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewChatModal(false)}
                    className="flex-1"
                  >
                    Отказ
                  </Button>
                  <Button
                    onClick={createNewChat}
                    disabled={
                      loading ||
                      !newChatForm.subject ||
                      !newChatForm.initial_message
                    }
                    className="flex-1"
                  >
                    {loading ? 'Създаване...' : 'Започни консултация'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VeterinaryChat;