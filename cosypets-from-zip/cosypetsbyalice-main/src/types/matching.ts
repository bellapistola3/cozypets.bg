export interface Sitter {
  id: string;
  name: string;
  profileImage: string;
  distanceKm: number;
  pricePerHour: number;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  preferredAnimals: string[];
  availabilityTags: string[];
  certifications: string[];
  city: string;
}

export interface Filters {
  animalType: string;
  dateFrom: string | null;
  dateTo: string | null;
  maxDistanceKm: number;
  minPrice: number | null;
  maxPrice: number | null;
  minExperienceYears: number | null;
  onlyCertified: boolean;
  availability: string[];
}

export interface MatchResult {
  sitterId: string;
  matchPct: number;
  reasoning: string;
  risks: string;
  compatibilityScore: number;
  petNeedsFit: string;
  aiSuggestion: string;
}

export interface SitterWithMatch extends MatchResult {
  sitter: Sitter;
}
