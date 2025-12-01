const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface PetInfo {
  type: string;
  breed?: string;
  age?: number;
  temperament?: string[];
  special_needs?: string;
}

const callAIEndpoint = async (mode: string, userRole: string, payload: any): Promise<string> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-handler`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mode, userRole, payload })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'AI request failed');
    }

    return data.content;
  } catch (error: any) {
    console.error('AI service error:', error);
    throw new Error(error.message || 'Failed to connect to AI service');
  }
};

export const matchSitters = async (
  petData: PetInfo,
  serviceType: string,
  location: string
): Promise<string> => {
  return await callAIEndpoint('matchSitters', 'owner', {
    petType: petData.type,
    serviceType,
    location,
    specialNeeds: petData.special_needs
  });
};

export const generateDailyReport = async (
  petName: string,
  activities: string[],
  notes?: string
): Promise<string> => {
  return await callAIEndpoint('dailyReport', 'sitter', {
    petName,
    activities,
    notes
  });
};

export const summarizeSitterProfile = async (
  sitter: any
): Promise<string> => {
  return await callAIEndpoint('profileSummary', 'owner', {
    name: sitter.profiles?.full_name || 'Unknown',
    experienceYears: sitter.experience_years || 0,
    rating: sitter.rating || 0,
    services: sitter.services || [],
    bio: sitter.profiles?.bio || ''
  });
};

export const moderateChatMessage = async (
  message: string
): Promise<string> => {
  return await callAIEndpoint('chatModeration', 'guest', {
    message
  });
};

export const askSiteAssistant = async (
  userRole: 'owner' | 'sitter' | 'guest',
  question: string
): Promise<string> => {
  return await callAIEndpoint('siteAssistant', userRole, {
    question
  });
};
