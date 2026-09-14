// Database-aligned TypeScript interfaces

export interface User {
  id?: string;
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  password_hash: string;
  role: 'owner' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface Sitter {
  id: string;
  sitter_id: number;
  user_id: number;
  bio?: string;
  photo_url?: string;
  hourly_rate: number;
  location: string;
  qualifications?: string;
  rating: number;
  created_at: Date;
  updated_at: Date;
  // Joined user data
  user?: User;
}

export interface Pet {
  pet_id: number;
  user_id: number;
  name: string;
  breed?: string;
  age?: number;
  health_status?: string;
  photo_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Reservation {
  reservation_id: number;
  owner_id: number;
  sitter_id: number;
  pet_id: number;
  start_date: Date;
  end_date: Date;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  created_at: Date;
  updated_at: Date;
  // Joined data
  owner?: User;
  sitter?: Sitter;
  pet?: Pet;
}

export interface Review {
  review_id: number;
  reservation_id: number;
  reviewer_id: number;
  sitter_id: number;
  rating: number; // 1-5
  comment?: string;
  created_at: Date;
  updated_at: Date;
  // Joined data
  reviewer?: User;
  sitter?: Sitter;
  reservation?: Reservation;
}

export interface Payment {
  payment_id: number;
  reservation_id: number;
  amount: number;
  payment_method: 'credit_card' | 'paypal' | 'bank_transfer';
  payment_status: 'pending' | 'completed' | 'failed';
  payment_date: Date;
  // Joined data
  reservation?: Reservation;
}

// Extended interfaces for frontend use
export interface SitterWithDetails extends Sitter {
  user: User;
  reviews: Review[];
  total_reviews: number;
  average_rating: number;
}

export interface ReservationWithDetails extends Reservation {
  owner: User;
  sitter: SitterWithDetails;
  pet: Pet;
  payment?: Payment;
  review?: Review;
}

export interface PetWithOwner extends Pet {
  owner: User;
}

// Search and filter types
export interface SitterSearchFilters {
  location?: string;
  min_rate?: number;
  max_rate?: number;
  min_rating?: number;
  start_date?: Date;
  end_date?: Date;
  qualifications?: string[];
}

export interface ReservationFilters {
  status?: 'pending' | 'confirmed' | 'completed' | 'canceled';
  start_date?: Date;
  end_date?: Date;
  owner_id?: number;
  sitter_id?: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Form types for creating/updating records
export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: 'owner' | 'admin';
}

export interface CreateSitterRequest {
  user_id: number;
  bio?: string;
  photo_url?: string;
  hourly_rate: number;
  location: string;
  qualifications?: string;
}

export interface CreatePetRequest {
  user_id: number;
  name: string;
  breed?: string;
  age?: number;
  health_status?: string;
  photo_url?: string;
}

export interface CreateReservationRequest {
  owner_id: number;
  sitter_id: number;
  pet_id: number;
  start_date: Date;
  end_date: Date;
  total_price: number;
}

export interface CreateReviewRequest {
  reservation_id: number;
  reviewer_id: number;
  sitter_id: number;
  rating: number;
  comment?: string;
}

export interface CreatePaymentRequest {
  reservation_id: number;
  amount: number;
  payment_method: 'credit_card' | 'paypal' | 'bank_transfer';
}

// Update types
export interface UpdateUserRequest extends Partial<Omit<CreateUserRequest, 'password'>> {
  password?: string;
}

export interface UpdateSitterRequest extends Partial<CreateSitterRequest> { }

export interface UpdatePetRequest extends Partial<CreatePetRequest> { }

export interface UpdateReservationRequest extends Partial<CreateReservationRequest> {
  status?: 'pending' | 'confirmed' | 'completed' | 'canceled';
}

export interface UpdatePaymentRequest {
  payment_status?: 'pending' | 'completed' | 'failed';
}

// Statistics and reporting types
export interface SitterStats {
  sitter_id: number;
  total_reservations: number;
  completed_reservations: number;
  total_earnings: number;
  average_rating: number;
  total_reviews: number;
}

export interface PlatformStats {
  total_users: number;
  total_sitters: number;
  total_pets: number;
  total_reservations: number;
  total_revenue: number;
  active_reservations: number;
  completed_reservations: number;
  average_rating: number;
}

export interface MonthlyReport {
  month: string;
  year: number;
  new_users: number;
  new_sitters: number;
  total_reservations: number;
  completed_reservations: number;
  total_revenue: number;
  platform_fees: number;
}

// Notification types
export interface Notification {
  id: string;
  user_id: number;
  type: 'reservation' | 'payment' | 'review' | 'message' | 'promotion';
  title: string;
  message: string;
  read: boolean;
  created_at: Date;
  action_url?: string;
}

// Chat/messaging types
export interface Message {
  id: string;
  sender_id: number;
  receiver_id: number;
  reservation_id?: number;
  content: string;
  message_type: 'text' | 'image' | 'file';
  sent_at: Date;
  read_at?: Date;
}

export interface Conversation {
  id: string;
  participants: number[];
  reservation_id?: number;
  last_message?: Message;
  updated_at: Date;
}