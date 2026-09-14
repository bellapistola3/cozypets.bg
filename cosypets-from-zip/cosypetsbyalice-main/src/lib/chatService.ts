import { dbHelpers } from './firebase';

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  reservation_id?: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface ChatRequest {
  id: string;
  reservation_id: string;
  owner_id: string;
  sitter_id: string;
  status: 'pending' | 'approved' | 'rejected';
  request_message?: string;
  admin_notes?: string;
  requested_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface ChatApprovalStatus {
  approved: boolean;
  canChat: boolean;
  requestStatus?: 'pending' | 'approved' | 'rejected';
  message?: string;
}

export const chatService = {
  async checkChatApproval(_reservationId: string, _userId: string): Promise<ChatApprovalStatus> {
    // In Firebase implementation, we might simplify or implement similar check
    return {
      approved: true,
      canChat: true,
      message: 'Чатът е разрешен.',
    };
  },

  async getMessages(reservationId: string, _userId: string) {
    try {
      const messages = await dbHelpers.getChatMessages(reservationId);
      return { data: messages || [], error: null, canChat: true, approvalStatus: { approved: true, canChat: true } };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return { data: [], error, canChat: false, approvalStatus: null };
    }
  },

  async sendMessage(
    reservationId: string,
    senderId: string,
    _receiverId: string,
    content: string,
    messageType: 'text' | 'image' | 'file' = 'text'
  ) {
    try {
      const data = await dbHelpers.sendChatChatMessage({
        chat_room_id: reservationId,
        sender_id: senderId,
        sender_type: 'user', // Need to determine from context or add as param
        message: content,
        message_type: messageType,
      });

      return {
        success: true,
        error: null,
        data,
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: 'Възникна грешка.',
        data: null,
      };
    }
  },

  async markMessagesAsRead(_reservationId: string, _userId: string) {
    // Implement in firebase.ts if needed
  },

  async getChatRequests(_userId: string, _userRole: 'owner' | 'sitter' | 'admin') {
    return { data: [], error: null };
  },

  subscribeToMessages(
    reservationId: string,
    callback: (message: any) => void
  ) {
    return dbHelpers.subscribeToChatMessages(reservationId, callback);
  },
};
