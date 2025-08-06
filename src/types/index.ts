export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: Date;
  isVerified: boolean;
}

export interface Sitter extends User {
  bio: string;
  experience: number;
  services: ServiceType[];
  location: {
    city: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  pricing: {
    [key in ServiceType]: number;
  };
  availability: {
    [key: string]: boolean; // date string as key
  };
  photos: string[];
  reviews: Review[];
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  languages: string[];
  petTypes: PetType[];
  emergencyContact: {
    name: string;
    phone: string;
  };
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
  petName: string;
  petType: PetType;
  serviceType: ServiceType;
}

export interface Booking {
  id: string;
  userId: string;
  sitterId: string;
  petId: string;
  serviceType: ServiceType;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  platformFee: number;
  reservationFee: number;
  status: BookingStatus;
  specialInstructions?: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  age: number;
  weight: number;
  photos: string[];
  medicalInfo?: string;
  specialNeeds?: string;
  vaccinated: boolean;
  spayedNeutered: boolean;
  microchipped: boolean;
  temperament: string[];
  emergencyVet: {
    name: string;
    phone: string;
    address: string;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'booking_request' | 'booking_response';
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: Date;
  bookingId?: string;
}

export type ServiceType = 'daily-walks' | 'home-visits' | 'overnight' | 'pet-taxi' | 'grooming';
export type PetType = 'dog' | 'cat' | 'bird' | 'small-mammal' | 'reptile' | 'other';
export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface SearchFilters {
  serviceType?: ServiceType;
  city?: string;
  petType?: PetType;
  startDate?: Date;
  endDate?: Date;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  availability?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'paypal';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface Insurance {
  id: string;
  bookingId: string;
  coverage: {
    veterinary: number;
    liability: number;
    property: number;
  };
  premium: number;
  active: boolean;
}