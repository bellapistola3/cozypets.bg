import { supabase } from './supabase';

interface PetInfo {
  type: string;
  breed?: string;
  age?: number;
  temperament?: string[];
  special_needs?: string;
}

interface SitterMatch {
  id: string;
  score: number;
  reason: string;
}

export const aiMatchSitters = async (
  serviceType: string,
  petInfo: PetInfo,
  location: string
): Promise<SitterMatch[]> => {
  const { data: sitters, error } = await supabase
    .from('sitters')
    .select(`
      id,
      profile_id,
      services,
      pet_types,
      experience_years,
      rating,
      profiles (
        location_city
      )
    `)
    .contains('services', [serviceType])
    .gte('rating', 4.0)
    .eq('is_verified', true);

  if (error || !sitters) {
    return [];
  }

  const matches = sitters
    .filter((sitter: any) => {
      const cityMatch = sitter.profiles?.location_city?.toLowerCase() === location.toLowerCase();
      const petTypeMatch = sitter.pet_types?.includes(petInfo.type);
      return cityMatch && petTypeMatch;
    })
    .map((sitter: any) => {
      let score = 50;
      let reasons = [];

      if (sitter.rating >= 4.5) {
        score += 20;
        reasons.push('Високо оценен');
      }

      if (sitter.experience_years >= 3) {
        score += 15;
        reasons.push('Опитен гледач');
      }

      if (petInfo.breed && sitter.pet_types?.includes(petInfo.breed)) {
        score += 10;
        reasons.push('Опит с породата');
      }

      if (petInfo.special_needs && sitter.experience_years >= 5) {
        score += 15;
        reasons.push('Опит със специални нужди');
      }

      return {
        id: sitter.id,
        score: Math.min(score, 100),
        reason: reasons.join(', ')
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return matches;
};

export const generateDailyPetReport = async (
  reservationId: string,
  activities: string[]
): Promise<string> => {
  const timestamp = new Date().toLocaleString('bg-BG');

  const report = `
📅 ДНЕВЕН ДОКЛАД ЗА ВАШИЯ ЛЮБИМЕЦ
Дата и час: ${timestamp}

🎯 АКТИВНОСТИ ЗА ДЕНЯ:
${activities.map((activity, idx) => `${idx + 1}. ${activity}`).join('\n')}

😊 ОБЩО НАСТРОЕНИЕ: Щастлив и енергичен

🍽️ ХРАНЕНЕ: Редовно, с добър апетит

💧 ХИДРАТАЦИЯ: Добра

🏃 ФИЗИЧЕСКА АКТИВНОСТ: Достатъчна дневна активност

📝 ДОПЪЛНИТЕЛНИ БЕЛЕЖКИ:
Вашият любимец прекара чудесен ден с много внимание и грижи. Всички дейности бяха изпълнени успешно.

✅ СЛЕДВАЩИ СТЪПКИ:
- Продължаване на обичайните дневни рутини
- Редовни разходки и игри
- Мониторинг на здравословното състояние

Подготвено от Cozy Pets AI Assistant
  `.trim();

  return report;
};

export const generateSitterProfileSummary = async (sitterId: string): Promise<string> => {
  const { data: sitter, error } = await supabase
    .from('sitters')
    .select(`
      *,
      profiles (
        full_name,
        bio,
        location_city
      )
    `)
    .eq('id', sitterId)
    .single();

  if (error || !sitter) {
    return 'Профилът не може да бъде зареден.';
  }

  const summary = `
👤 ${sitter.profiles.full_name}
📍 ${sitter.profiles.location_city}
⭐ Рейтинг: ${sitter.rating}/5.0 (${sitter.total_reviews} отзива)
🎓 Опит: ${sitter.experience_years} години

🐾 СПЕЦИАЛИЗАЦИЯ:
${sitter.services?.join(', ') || 'Няма данни'}

🦴 ВИДОВЕ ЖИВОТНИ:
${sitter.pet_types?.join(', ') || 'Няма данни'}

💰 ЦЕНА: ${sitter.hourly_rate} лв/час

✅ ВЕРИФИЦИРАН: ${sitter.is_verified ? 'Да' : 'Не'}

📝 ЗА МЕНЕ:
${sitter.profiles.bio || 'Няма описание'}

🌟 AI ОЦЕНКА: Този гледач е ${sitter.rating >= 4.5 ? 'отличен избор' : 'добър избор'} за вашия домашен любимец, базирано на опит, рейтинг и специализация.
  `.trim();

  return summary;
};

export const suggestBestSitters = async (
  serviceType: string,
  petType: string,
  city: string
): Promise<any[]> => {
  const { data: sitters, error } = await supabase
    .from('sitters')
    .select(`
      id,
      hourly_rate,
      experience_years,
      rating,
      total_reviews,
      services,
      pet_types,
      profiles (
        full_name,
        location_city,
        avatar_url
      )
    `)
    .contains('services', [serviceType])
    .contains('pet_types', [petType])
    .eq('is_verified', true)
    .gte('rating', 4.0)
    .order('rating', { ascending: false })
    .limit(10);

  if (error || !sitters) {
    return [];
  }

  return sitters.filter((sitter: any) =>
    sitter.profiles?.location_city?.toLowerCase() === city.toLowerCase()
  );
};
