export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorMessages = {
  AUTH_FAILED: 'Грешка при влизане. Моля, проверете имейла и паролата си.',
  AUTH_EMAIL_EXISTS: 'Този имейл вече е регистриран.',
  AUTH_INVALID_CREDENTIALS: 'Невалиден имейл или парола.',
  AUTH_USER_NOT_FOUND: 'Потребителят не е намерен.',
  NETWORK_ERROR: 'Грешка в мрежата. Моля, проверете интернет връзката си.',
  DATABASE_ERROR: 'Грешка при запис в базата данни.',
  PERMISSION_DENIED: 'Нямате права за тази операция.',
  NOT_FOUND: 'Ресурсът не е намерен.',
  VALIDATION_ERROR: 'Моля, проверете въведените данни.',
  UNKNOWN_ERROR: 'Възникна неочаквана грешка. Моля, опитайте отново.',
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('email') && message.includes('already')) {
      return errorMessages.AUTH_EMAIL_EXISTS;
    }

    if (message.includes('invalid') && (message.includes('credentials') || message.includes('password'))) {
      return errorMessages.AUTH_INVALID_CREDENTIALS;
    }

    if (message.includes('user not found')) {
      return errorMessages.AUTH_USER_NOT_FOUND;
    }

    if (message.includes('network') || message.includes('fetch')) {
      return errorMessages.NETWORK_ERROR;
    }

    if (message.includes('permission') || message.includes('policy')) {
      return errorMessages.PERMISSION_DENIED;
    }

    if (message.includes('not found')) {
      return errorMessages.NOT_FOUND;
    }

    return error.message;
  }

  return errorMessages.UNKNOWN_ERROR;
}

export function handleError(error: unknown): void {
  const message = getErrorMessage(error);
  console.error('Error:', error);
  alert(message);
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  customErrorMessage?: string
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    console.error('Operation failed:', error);
    const message = customErrorMessage || getErrorMessage(error);
    alert(message);
    return null;
  }
}
