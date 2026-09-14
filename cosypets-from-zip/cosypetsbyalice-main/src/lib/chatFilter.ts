import { dbHelpers } from './firebase';

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

  const violation = await dbHelpers.getChatViolations(userId);

  const currentCount = (violation as any)?.violation_count || 0;
  const newCount = currentCount + 1;

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

  await dbHelpers.updateChatViolations(userId, {
    violation_count: newCount,
    last_violation_at: new Date().toISOString(),
    is_banned: isBanned,
    is_read_only: isReadOnly,
    ban_expires_at: banExpiresAt
  });

  return {
    isBlocked: true,
    reason: 'For safety reasons, contact details can only be shared after a confirmed booking.',
    violationCount: newCount,
    isBanned,
    isReadOnly
  };
};

export const getUserChatStatus = async (userId: string) => {
  const data = await dbHelpers.getChatViolations(userId);

  if (!data) {
    return { canSend: true, isReadOnly: false, isBanned: false };
  }

  const violation = data as any;

  if (violation.is_banned && violation.ban_expires_at) {
    const banExpires = new Date(violation.ban_expires_at);
    if (new Date() < banExpires) {
      return { canSend: false, isReadOnly: false, isBanned: true, banExpiresAt: banExpires };
    } else {
      await dbHelpers.updateChatViolations(userId, { is_banned: false, ban_expires_at: null });
      return { canSend: true, isReadOnly: false, isBanned: false };
    }
  }

  return {
    canSend: !violation.is_read_only,
    isReadOnly: violation.is_read_only,
    isBanned: false,
    violationCount: violation.violation_count
  };
};
