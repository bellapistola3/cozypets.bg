interface PetInfo {
  type: string;
  breed?: string;
  age?: number;
  temperament?: string[];
  special_needs?: string;
}

const callAIEndpoint = async (mode: string, userRole: string, payload: any): Promise<string> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Local simulated responses for development/demo purposes
  // This replaces the previous dependency on Supabase Edge Functions
  switch (mode) {
    case 'siteAssistant':
      if (payload.question?.toLowerCase().includes('цена') || payload.question?.toLowerCase().includes('колко')) {
        return "Цените на нашите гледачи варират от 10 до 25 лв. на час, в зависимост от опита и услугите. Можете да видите точните цени в профила на всеки гледач.";
      }
      if (payload.question?.toLowerCase().includes('как работи')) {
        return "Cozy Pets свързва собственици на домашни любимци с доверени гледачи. Просто потърсете гледач във вашия район, изберете подходящия и направете резервация!";
      }
      return `Здравейте! Като вашия AI асистент (Alice), се радвам да ви помогна с въпроса: "${payload.question}". В момента работя в тестов режим, но скоро ще мога да ви давам още по-подробни съвети!`;

    case 'matchSitters':
      return "Намерих няколко перфектни съвпадения за вашето куче в района на София! Препоръчвам ви Мария Стефанова поради големия й опит с Голдън ретрийвъри.";

    case 'profileSummary':
      return `${payload.name} е изключително опитен гледач с ${payload.experienceYears} години стаж и отличен рейтинг от ${payload.rating}/5. Силно препоръчан за активни кучета.`;

    case 'dailyReport':
      return `Днес ${payload.petName} беше много активен! Имахме дълга разходка в парка (45 мин), играхме с любимата играчка и се нахранихме навреме. Всичко е наред!`;

    case 'chatModeration':
      return "ok";

    default:
      return "Alice е тук, за да помогне! Моля, задайте своя въпрос.";
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
    name: sitter.profiles?.full_name || sitter.name || 'Unknown',
    experienceYears: sitter.experience_years || sitter.experience || 0,
    rating: sitter.rating || 0,
    services: sitter.services || [],
    bio: sitter.profiles?.bio || sitter.bio || ''
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
