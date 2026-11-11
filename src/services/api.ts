import {
  Message,
  CreateMessagePayload,
  CreateMessageResponse,
  ApiError,
} from '../types';

const PRODUCTION_API_BASE_URL = 'https://amsham-backend-production.up.railway.app/api/messages/';
const DEFAULT_API_BASE_URL = import.meta.env.DEV
  ? '/api/messages/'
  : import.meta.env.VITE_API_BASE_URL?.trim() || PRODUCTION_API_BASE_URL;
const RELATIVE_API_BASE_URL = /^\/api\/messages\/?$/i;
const LEGACY_LOCAL_API_BASE_URL = /^https?:\/\/(?:localhost|127\.0\.0\.1):8000\/api\/messages\/?$/i;
const PRODUCTION_API_URL = /^https:\/\/amsham-backend-production\.up\.railway\.app\/api\/messages\/?$/i;
const STORAGE_KEY_API_URL = 'unsent_api_base_url';

export function getApiBaseUrl(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_API_URL);
    if (stored?.trim()) {
      const configuredUrl = stored.trim();
      if (LEGACY_LOCAL_API_BASE_URL.test(configuredUrl)) {
        return import.meta.env.DEV ? '/api/messages/' : DEFAULT_API_BASE_URL;
      }
      if (import.meta.env.DEV && PRODUCTION_API_URL.test(configuredUrl)) {
        return '/api/messages/';
      }
      if (!import.meta.env.DEV && RELATIVE_API_BASE_URL.test(configuredUrl)) {
        return DEFAULT_API_BASE_URL;
      }
      return configuredUrl;
    }
  } catch {
    // Storage may be unavailable in restricted browser contexts.
  }
  return DEFAULT_API_BASE_URL;
}

export function setApiBaseUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_API_URL, url.trim());
  } catch {
    // The configured URL remains usable for the current page session.
  }
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object'
    && error !== null
    && 'message' in error
    && typeof error.message === 'string'
    && !('name' in error && error.name === 'TypeError')
  );
}

function isMessageStatus(status: unknown): status is Message['status'] {
  return status === 'PENDING' || status === 'APPROVED' || status === 'REJECTED';
}

function parseMessage(data: unknown): Message {
  if (
    typeof data !== 'object'
    || data === null
    || !('id' in data)
    || typeof data.id !== 'number'
    || !('content' in data)
    || typeof data.content !== 'string'
    || !('status' in data)
    || !isMessageStatus(data.status)
    || !('created_at' in data)
    || typeof data.created_at !== 'string'
  ) {
    throw {
      message: 'The server returned a message in an unexpected format.',
    } satisfies ApiError;
  }

  const recipientName = 'recipient' in data
    ? data.recipient
    : 'recipient_name' in data
      ? data.recipient_name
      : undefined;

  if (typeof recipientName !== 'string') {
    throw {
      message: 'The server returned a message in an unexpected format.',
    } satisfies ApiError;
  }

  return {
    id: data.id,
    recipient_name: recipientName,
    content: data.content,
    status: data.status,
    created_at: data.created_at,
  };
}

async function parseDjangoError(response: Response): Promise<ApiError> {
  const status = response.status;

  if (status === 404) {
    return { message: 'The requested API endpoint was not found.', status };
  }

  if (status === 429) {
    return {
      message: 'Too many requests. Please slow down and try again later.',
      status,
    };
  }

  if (status >= 500) {
    return {
      message: 'A server error occurred. Please try again later.',
      status,
    };
  }

  try {
    const data: unknown = await response.json();
    if (typeof data === 'object' && data !== null) {
      const fieldErrors: Record<string, string[]> = {};
      let firstErrorMessage = '';

      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          fieldErrors[key] = value.map(String);
          if (!firstErrorMessage && value.length > 0) {
            firstErrorMessage = `${key}: ${String(value[0])}`;
          }
        } else if (typeof value === 'string') {
          if (key === 'detail') return { message: value, status };
          fieldErrors[key] = [value];
          if (!firstErrorMessage) firstErrorMessage = `${key}: ${value}`;
        }
      }

      if (Object.keys(fieldErrors).length > 0) {
        return {
          message: firstErrorMessage || 'Validation error. Please check your input.',
          fieldErrors,
          status,
        };
      }
    }
  } catch {
    // Use the status-based message for non-JSON responses.
  }

  return {
    message: status === 400
      ? 'Bad request. Please review your submission.'
      : 'An unexpected error occurred. Please try again.',
    status,
  };
}

function getEndpoint(path: string): string {
  return `${getApiBaseUrl().replace(/\/+$/, '')}/${path}`;
}

async function throwRequestError(error: unknown): Promise<never> {
  if (isApiError(error)) throw error;
  throw {
    message: 'Unable to connect to the server. Check the API URL and try again.',
    isNetworkError: true,
  } satisfies ApiError;
}

export async function submitMessage(payload: CreateMessagePayload): Promise<CreateMessageResponse> {
  const recipientName = payload.recipient_name.trim();
  const content = payload.content.trim();

  if (!recipientName || !content) {
    throw {
      message: 'Please enter both a recipient name and a message.',
      fieldErrors: {
        ...(!recipientName ? { recipient_name: ['This field may not be blank.'] } : {}),
        ...(!content ? { content: ['This field may not be blank.'] } : {}),
      },
      status: 400,
    } satisfies ApiError;
  }

  try {
    const response = await fetch(getEndpoint('create/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        recipient_name: recipientName,
        content,
      }),
    });

    if (!response.ok) throw await parseDjangoError(response);
    return parseMessage(await response.json());
  } catch (error: unknown) {
    return throwRequestError(error);
  }
}

export async function searchMessages(nameQuery: string): Promise<Message[]> {
  const name = nameQuery.trim();
  const params = new URLSearchParams();
  if (name) params.set('name', name);

  try {
    const query = params.toString();
    const endpoint = `${getEndpoint('search/')}${query ? `?${query}` : ''}`;
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) throw await parseDjangoError(response);

    const data: unknown = await response.json();
    const results = Array.isArray(data)
      ? data
      : typeof data === 'object' && data !== null && 'results' in data && Array.isArray(data.results)
        ? data.results
        : null;

    if (!results) {
      throw {
        message: 'The server returned search results in an unexpected format.',
      } satisfies ApiError;
    }

    return results
      .map(parseMessage)
      .filter((message) => message.status === 'APPROVED');
  } catch (error: unknown) {
    return throwRequestError(error);
  }
}
