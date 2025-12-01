import { supabase } from './supabase';

const BLOCKED_PATTERNS = [
  /\b\d{8,12}\b/g,
  /\+359\s?\d{9}/gi,
  /\b0\d{9}\b/g,
  /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/gi,
  /https?:\/\/[^\s]+/gi,
  /www\.[^\s]+/gi,
  /whatsapp/gi,
  /viber/gi,
  /telegram/gi,
  /facebook/gi,
  /instagram/gi,
  /адрес/gi,
  /телефон/gi,
  /звънни\s+ми/gi,
  /обади\s+ми\s+се/gi,
  /пиши\s+ми/gi,
];

export interface ChatFilterResult {
  isBlocked: boolean;
  reason?: string;
  violationCount?: number;
  isBanned?: boolean;
  isReadOnly?: boolean;
}

export const checkMessageContent = (message: string): boolean => {
  return BLOCKED_PATTERNS.some(pattern => pattern.test(message));
};

export const filterChatMessage = async (userId: string, message: string): Promise<ChatFilterResult> => {
  const isViolation = checkMessageContent(message);

  if (!isViolation) {
    return { isBlocked: false };
  }

  const { data: violation, error } = await supabase
    .from('chat_violations')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching violations:', error);
    return { isBlocked: true, reason: 'System error' };
  }

  const currentCount = violation?.violation_count || 0;
  const newCount = currentCount + 1;

  const now = new Date().toISOString();
  let isBanned = false;
  let isReadOnly = false;
  let banExpiresAt = null;

  if (newCount === 2) {
    isReadOnly = true;
  } else if (newCount >= 3) {
    isBanned = true;
    const banExpiration = new Date();
    banExpiration.setHours(banExpiration.getHours() + 48);
    banExpiresAt = banExpiration.toISOString();
  }

  if (violation) {
    await supabase
      .from('chat_violations')
      .update({
        violation_count: newCount,
        last_violation_at: now,
        is_banned: isBanned,
        is_read_only: isReadOnly,
        ban_expires_at: banExpiresAt,
        updated_at: now
      })
      .eq('id', violation.id);
  } else {
    await supabase
      .from('chat_violations')
      .insert({
        user_id: userId,
        violation_count: newCount,
        last_violation_at: now,
        is_banned: isBanned,
        is_read_only: isReadOnly,
        ban_expires_at: banExpiresAt
      });
  }

  return {
    isBlocked: true,
    reason: 'For safety reasons, contact details can only be shared after a confirmed booking.',
    violationCount: newCount,
    isBanned,
    isReadOnly
  };
};

export const getUserChatStatus = async (userId: string) => {
  const { data, error } = await supabase
    .from('chat_violations')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) {
    return { canSend: true, isReadOnly: false, isBanned: false };
  }

  if (data.is_banned && data.ban_expires_at) {
    const banExpires = new Date(data.ban_expires_at);
    if (new Date() < banExpires) {
      return { canSend: false, isReadOnly: false, isBanned: true, banExpiresAt: banExpires };
    } else {
      await supabase
        .from('chat_violations')
        .update({ is_banned: false, ban_expires_at: null })
        .eq('id', data.id);
      return { canSend: true, isReadOnly: false, isBanned: false };
    }
  }

  return {
    canSend: !data.is_read_only,
    isReadOnly: data.is_read_only,
    isBanned: false,
    violationCount: data.violation_count
  };
};
