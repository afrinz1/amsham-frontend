export type MessageStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Message {
  id: number;
  recipient_name: string;
  content: string;
  status: MessageStatus;
  created_at: string;
}

export interface CreateMessagePayload {
  recipient_name: string;
  content: string;
}

export interface CreateMessageResponse {
  id: number;
  recipient_name: string;
  content: string;
  status: MessageStatus;
  created_at: string;
}

export interface ApiError {
  message: string;
  fieldErrors?: Record<string, string[]>;
  status?: number;
  isNetworkError?: boolean;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  duration?: number;
}
