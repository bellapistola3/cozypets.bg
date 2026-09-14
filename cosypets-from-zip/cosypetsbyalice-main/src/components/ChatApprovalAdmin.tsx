import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, MessageCircle, User, Calendar } from 'lucide-react';
import { chatService } from '../lib/chatService';
import { useAuth } from '../contexts/AuthContext';
import Button from './common/Button';

const ChatApprovalAdmin: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [approvalLoading, setApprovalLoading] = useState<string | null>(null);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user, filter]);

  const loadRequests = async () => {
    if (!user) return;

    setLoading(true);
    const result = await chatService.getChatRequests(user.id, 'admin');

    if (result.data) {
      const filteredRequests =
        filter === 'all'
          ? result.data
          : result.data.filter((req: any) => req.status === filter);
      setRequests(filteredRequests);
    }

    setLoading(false);
  };

  const handleApprove = async (requestId: string) => {
    if (!user) return;

    setApprovalLoading(requestId);

    const result = await chatService.approveChatRequest(
      requestId,
      user.id,
      notes[requestId] || 'Одобрено от администратор'
    );

    if (result.success) {
      await loadRequests();
      setNotes((prev) => {
        const newNotes = { ...prev };
        delete newNotes[requestId];
        return newNotes;
      });
    } else {
      alert('Грешка при одобрение: ' + result.error);
    }

    setApprovalLoading(null);
  };

  const handleReject = async (requestId: string) => {
    if (!user) return;

    const reason = notes[requestId] || prompt('Причина за отказ:');
    if (!reason) return;

    setApprovalLoading(requestId);

    const result = await chatService.rejectChatRequest(requestId, user.id, reason);

    if (result.success) {
      await loadRequests();
      setNotes((prev) => {
        const newNotes = { ...prev };
        delete newNotes[requestId];
        return newNotes;
      });
    } else {
      alert('Грешка при отказ: ' + result.error);
    }

    setApprovalLoading(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
            <Clock className="h-4 w-4" />
            Чакащо
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            Одобрено
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
            <XCircle className="h-4 w-4" />
            Отказано
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление на чат заявки</h1>
        <p className="text-gray-600">
          Одобрявайте или отказвайте заявки за чат комуникация между собственици и гледачи
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                filter === status
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status === 'all' && 'Всички'}
              {status === 'pending' && 'Чакащи'}
              {status === 'approved' && 'Одобрени'}
              {status === 'rejected' && 'Отказани'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-4">Зареждане на заявки...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Няма заявки за показване</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Заявка за чат #{request.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Заявена на: {formatDate(request.requested_at)}
                    </p>
                  </div>
                </div>
                {getStatusBadge(request.status)}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Собственик</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-900">
                      {request.owner?.full_name || 'Неизвестен'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Гледач</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-900">
                      {request.sitter?.profile?.full_name || 'Неизвестен'}
                    </span>
                  </div>
                </div>
              </div>

              {request.request_message && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Съобщение</p>
                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    {request.request_message}
                  </p>
                </div>
              )}

              {request.status === 'pending' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Бележки (незадължително)
                    </label>
                    <textarea
                      value={notes[request.id] || ''}
                      onChange={(e) =>
                        setNotes((prev) => ({ ...prev, [request.id]: e.target.value }))
                      }
                      placeholder="Добавете бележки или коментари..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApprove(request.id)}
                      disabled={approvalLoading === request.id}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {approvalLoading === request.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Обработване...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Одобри
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleReject(request.id)}
                      disabled={approvalLoading === request.id}
                      variant="outline"
                      className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                    >
                      {approvalLoading === request.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Обработване...
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 mr-2" />
                          Откажи
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Статус</p>
                  <p className="text-sm text-gray-600">
                    {request.status === 'approved' ? 'Одобрено' : 'Отказано'} на{' '}
                    {request.reviewed_at && formatDate(request.reviewed_at)}
                  </p>
                  {request.admin_notes && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">Бележки</p>
                      <p className="text-sm text-gray-600">{request.admin_notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatApprovalAdmin;
