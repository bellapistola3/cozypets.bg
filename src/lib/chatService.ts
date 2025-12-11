import { supabase } from './supabase';

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
  async checkChatApproval(reservationId: string, userId: string): Promise<ChatApprovalStatus> {
    try {
      const { data: reservation, error: resError } = await supabase
        .from('reservations')
        .select('chat_approved, owner_id, sitter_id, sitters!inner(profile_id)')
        .eq('id', reservationId)
        .single();

      if (resError || !reservation) {
        return {
          approved: false,
          canChat: false,
          message: 'Резервацията не е намерена.',
        };
      }

      const isSitter = (reservation.sitters as any).profile_id === userId;
      const isOwner = reservation.owner_id === userId;

      if (!isSitter && !isOwner) {
        return {
          approved: false,
          canChat: false,
          message: 'Нямате достъп до този чат.',
        };
      }

      if (reservation.chat_approved) {
        return {
          approved: true,
          canChat: true,
          requestStatus: 'approved',
          message: 'Чатът е одобрен.',
        };
      }

      const { data: chatRequest } = await supabase
        .from('chat_requests')
        .select('status')
        .eq('reservation_id', reservationId)
        .maybeSingle();

      return {
        approved: false,
        canChat: false,
        requestStatus: chatRequest?.status || 'pending',
        message:
          chatRequest?.status === 'rejected'
            ? 'Заявката за чат е отказана.'
            : 'Чакайте одобрение от администратор за да започнете чат.',
      };
    } catch (error) {
      console.error('Error checking chat approval:', error);
      return {
        approved: false,
        canChat: false,
        message: 'Грешка при проверка на одобрението.',
      };
    }
  },

  async getMessages(reservationId: string, userId: string) {
    try {
      const approval = await this.checkChatApproval(reservationId, userId);

      if (!approval.canChat) {
        return { data: [], error: null, canChat: false, approvalStatus: approval };
      }

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url),
          receiver:profiles!messages_receiver_id_fkey(id, full_name, avatar_url)
        `)
        .eq('reservation_id', reservationId)
        .order('created_at', { ascending: true });

      return { data: data || [], error, canChat: true, approvalStatus: approval };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return { data: [], error, canChat: false, approvalStatus: null };
    }
  },

  async sendMessage(
    reservationId: string,
    senderId: string,
    receiverId: string,
    content: string,
    messageType: 'text' | 'image' | 'file' = 'text'
  ) {
    try {
      const approval = await this.checkChatApproval(reservationId, senderId);

      if (!approval.canChat) {
        return {
          success: false,
          error: approval.message || 'Чатът не е одобрен.',
          data: null,
        };
      }

      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: senderId,
            receiver_id: receiverId,
            reservation_id: reservationId,
            content,
            message_type: messageType,
            is_read: false,
          },
        ])
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url),
          receiver:profiles!messages_receiver_id_fkey(id, full_name, avatar_url)
        `)
        .single();

      if (error) {
        console.error('Error sending message:', error);
        return {
          success: false,
          error: 'Грешка при изпращане на съобщението.',
          data: null,
        };
      }

      await supabase.from('notifications').insert([
        {
          user_id: receiverId,
          type: 'message',
          title: 'Ново съобщение',
          message: `Получихте ново съобщение.`,
          action_url: `/chat/${reservationId}`,
          is_read: false,
        },
      ]);

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

  async markMessagesAsRead(reservationId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('reservation_id', reservationId)
        .eq('receiver_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking messages as read:', error);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  },

  async getChatRequests(userId: string, userRole: 'owner' | 'sitter' | 'admin') {
    try {
      let query = supabase
        .from('chat_requests')
        .select(`
          *,
          reservation:reservations(*),
          owner:profiles!chat_requests_owner_id_fkey(id, full_name, avatar_url),
          sitter:sitters!inner(
            id,
            profile:profiles(id, full_name, avatar_url)
          )
        `);

      if (userRole === 'owner') {
        query = query.eq('owner_id', userId);
      } else if (userRole === 'sitter') {
        query = query.eq('sitter.profile_id', userId);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching chat requests:', error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching chat requests:', error);
      return { data: [], error };
    }
  },

  async approveChatRequest(requestId: string, adminId: string, notes?: string) {
    try {
      const { data, error } = await supabase.rpc('approve_chat_request', {
        request_id: requestId,
        admin_id: adminId,
        notes: notes || null,
      });

      if (error) {
        console.error('Error approving chat request:', error);
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Error approving chat request:', error);
      return { success: false, error: 'Възникна грешка.' };
    }
  },

  async rejectChatRequest(requestId: string, adminId: string, reason: string) {
    try {
      const { data, error } = await supabase.rpc('reject_chat_request', {
        request_id: requestId,
        admin_id: adminId,
        reason: reason,
      });

      if (error) {
        console.error('Error rejecting chat request:', error);
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Error rejecting chat request:', error);
      return { success: false, error: 'Възникна грешка.' };
    }
  },

  subscribeToMessages(
    reservationId: string,
    callback: (message: any) => void
  ) {
    const subscription = supabase
      .channel(`messages:${reservationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `reservation_id=eq.${reservationId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();

    return subscription;
  },
};
