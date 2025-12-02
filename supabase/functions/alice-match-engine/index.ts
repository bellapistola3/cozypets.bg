import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Sitter {
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

interface Filters {
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

interface MatchResult {
  sitterId: string;
  matchPct: number;
  reasoning: string;
  risks: string;
  compatibilityScore: number;
  petNeedsFit: string;
  aiSuggestion: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { filters, sitters }: { filters: Filters; sitters: Sitter[] } = await req.json();

    const matches: MatchResult[] = sitters.map((sitter) => {
      let score = 50;
      let reasoningPoints: string[] = [];
      let riskPoints: string[] = [];

      if (sitter.distanceKm <= filters.maxDistanceKm) {
        if (sitter.distanceKm <= 2) {
          score += 15;
          reasoningPoints.push(`Много близо до вас (${sitter.distanceKm} км)`);
        } else if (sitter.distanceKm <= 5) {
          score += 12;
          reasoningPoints.push(`На удобно разстояние (${sitter.distanceKm} км)`);
        } else if (sitter.distanceKm <= 10) {
          score += 8;
        } else {
          score += 5;
        }
      } else if (sitter.distanceKm <= filters.maxDistanceKm + 5) {
        score += 5;
        riskPoints.push(`Малко извън желаното разстояние (${sitter.distanceKm} км)`);
      } else {
        score -= 15;
        riskPoints.push(`Значително извън желаното разстояние (${sitter.distanceKm} км)`);
      }

      if (filters.animalType !== 'any') {
        if (sitter.preferredAnimals.includes(filters.animalType)) {
          score += 20;
          reasoningPoints.push(`Специализиран в грижа за ${getAnimalLabel(filters.animalType)}`);
        } else if (sitter.preferredAnimals.includes('other') || sitter.preferredAnimals.length > 2) {
          score += 5;
          reasoningPoints.push('Работи с различни видове животни');
        } else {
          score -= 20;
          riskPoints.push(`Няма посочен опит с ${getAnimalLabel(filters.animalType)}`);
        }
      }

      if (sitter.experienceYears >= 5) {
        score += 10;
        reasoningPoints.push(`Богат опит (${sitter.experienceYears}+ години)`);
      } else if (sitter.experienceYears >= 3) {
        score += 8;
        reasoningPoints.push(`Добър опит (${sitter.experienceYears} години)`);
      } else if (sitter.experienceYears >= 1) {
        score += 5;
      } else {
        score -= 5;
        riskPoints.push('Ограничен професионален опит');
      }

      if (filters.minExperienceYears !== null && sitter.experienceYears < filters.minExperienceYears) {
        score -= 10;
        riskPoints.push(`По-малко опит от желаните ${filters.minExperienceYears} години`);
      }

      if (filters.minPrice !== null || filters.maxPrice !== null) {
        const minP = filters.minPrice || 0;
        const maxP = filters.maxPrice || Infinity;

        if (sitter.pricePerHour >= minP && sitter.pricePerHour <= maxP) {
          score += 8;
          if (sitter.pricePerHour <= 12) {
            reasoningPoints.push('Отлична цена за качеството');
          } else if (sitter.pricePerHour <= 15) {
            reasoningPoints.push('Справедлива цена');
          }
        } else if (sitter.pricePerHour > maxP) {
          const diff = sitter.pricePerHour - maxP;
          if (diff <= 3) {
            score += 3;
            riskPoints.push(`Малко над бюджета (${sitter.pricePerHour} лв/час)`);
          } else {
            score -= 8;
            riskPoints.push(`Цената (${sitter.pricePerHour} лв/час) значително надвишава бюджета`);
          }
        } else if (sitter.pricePerHour < minP && sitter.pricePerHour < 8) {
          score -= 5;
          riskPoints.push('Необичайно ниска цена - проверете качеството');
        }
      }

      if (filters.availability.length > 0) {
        const matchingAvailability = filters.availability.filter(a =>
          sitter.availabilityTags.includes(a)
        );
        const matchRatio = matchingAvailability.length / filters.availability.length;

        if (matchRatio === 1) {
          score += 15;
          reasoningPoints.push('Напълно съвпада с вашата необходима наличност');
        } else if (matchRatio >= 0.5) {
          score += 8;
        } else if (matchRatio > 0) {
          score += 3;
          riskPoints.push('Частично съвпада с желаната наличност');
        } else {
          score -= 15;
          riskPoints.push('Не съвпада с необходимата ви наличност');
        }
      }

      if (sitter.rating >= 4.9) {
        score += 15;
        reasoningPoints.push(`Перфектен рейтинг (${sitter.rating}⭐)`);
      } else if (sitter.rating >= 4.7) {
        score += 12;
        reasoningPoints.push(`Отличен рейтинг (${sitter.rating}⭐)`);
      } else if (sitter.rating >= 4.5) {
        score += 8;
      } else if (sitter.rating >= 4.0) {
        score += 3;
      } else {
        score -= 10;
        riskPoints.push(`Нисък рейтинг (${sitter.rating}⭐)`);
      }

      if (sitter.reviewsCount >= 40) {
        score += 5;
        reasoningPoints.push(`Много положителни отзиви (${sitter.reviewsCount})`);
      } else if (sitter.reviewsCount >= 20) {
        score += 3;
      } else if (sitter.reviewsCount < 10) {
        score -= 3;
        riskPoints.push('Малко отзиви от клиенти - нов на платформата');
      }

      if (filters.onlyCertified) {
        if (sitter.certifications.length >= 2) {
          score += 10;
          reasoningPoints.push(`Множество сертификати (${sitter.certifications.join(', ')})`);
        } else if (sitter.certifications.length === 1) {
          score += 7;
          reasoningPoints.push(`Сертифициран: ${sitter.certifications[0]}`);
        } else {
          score -= 10;
          riskPoints.push('Няма официални сертификати');
        }
      } else {
        if (sitter.certifications.length >= 2) {
          score += 8;
          reasoningPoints.push(`Допълнителни квалификации: ${sitter.certifications.slice(0, 2).join(', ')}`);
        } else if (sitter.certifications.length === 1) {
          score += 5;
        }
      }

      score = Math.max(0, Math.min(100, Math.round(score)));

      let reasoning = '';
      if (score >= 80) {
        reasoning = `${sitter.name} е изключителен избор за вашия любимец. `;
      } else if (score >= 65) {
        reasoning = `${sitter.name} е много добър избор, който ще отговори на вашите нужди. `;
      } else if (score >= 50) {
        reasoning = `${sitter.name} е приемлив избор с някои компромиси. `;
      } else {
        reasoning = `${sitter.name} може да не е най-подходящият за вашите критерии. `;
      }

      if (reasoningPoints.length > 0) {
        reasoning += reasoningPoints.slice(0, 3).join('. ') + '.';
      } else {
        reasoning += `Живее в ${sitter.city} и има ${sitter.experienceYears} години опит.`;
      }

      let risks = '';
      if (riskPoints.length > 0) {
        risks = `Обърнете внимание: ${riskPoints.join('; ')}.`;
      } else {
        risks = 'Няма значителни рискове или опасения. Отличен избор за вашия любимец!';
      }

      let compatibilityScore: number;
      if (score >= 85) {
        compatibilityScore = 5;
      } else if (score >= 70) {
        compatibilityScore = 4;
      } else if (score >= 55) {
        compatibilityScore = 3;
      } else if (score >= 35) {
        compatibilityScore = 2;
      } else {
        compatibilityScore = 1;
      }

      let petNeedsFit = '';
      const animalTypeLabel = filters.animalType !== 'any' ? getAnimalLabel(filters.animalType) : 'вашето животно';

      if (compatibilityScore >= 4) {
        petNeedsFit = `${sitter.name} показва отлична емоционална съвместимост с ${animalTypeLabel}. `;
        if (sitter.experienceYears >= 4) {
          petNeedsFit += 'Богатият опит гарантира спокойно и професионално отношение. ';
        }
        if (sitter.certifications.length > 0) {
          petNeedsFit += 'Сертификатите потвърждават способността да се справя с различни поведенчески нужди и здравни ситуации.';
        } else {
          petNeedsFit += 'Внимателният подход създава безопасна среда за вашия любимец.';
        }
      } else if (compatibilityScore === 3) {
        petNeedsFit = `${sitter.name} може да се грижи адекватно за ${animalTypeLabel}, но има някои ограничения. `;
        if (sitter.experienceYears < 3) {
          petNeedsFit += 'Относително новият опит означава, че може да се справи по-добре с по-спокойни животни. ';
        }
        petNeedsFit += 'Препоръчително е предварителна среща, за да оцените съвместимостта.';
      } else {
        petNeedsFit = `${sitter.name} може да има предизвикателства при грижата за ${animalTypeLabel}. `;
        if (!sitter.preferredAnimals.includes(filters.animalType) && filters.animalType !== 'any') {
          petNeedsFit += 'Липсата на специализиран опит с този вид животно може да доведе до стрес. ';
        }
        petNeedsFit += 'Обмислете друг вариант, който по-добре отговаря на нуждите на вашия любимец.';
      }

      let aiSuggestion = '';
      if (score >= 85) {
        aiSuggestion = 'Силно препоръчан – отговаря на всички изисквания и надхвърля очакванията! 🌟';
      } else if (score >= 70) {
        aiSuggestion = 'Препоръчан – отличен избор с минимални компромиси.';
      } else if (score >= 55) {
        if (sitter.distanceKm > filters.maxDistanceKm) {
          aiSuggestion = 'Умерено препоръчан – обмислете разстоянието преди резервация.';
        } else if (riskPoints.some(r => r.includes('наличност'))) {
          aiSuggestion = 'Добър вариант, но проверете наличността предварително.';
        } else {
          aiSuggestion = 'Приемлив избор – оценете внимателно рисковете.';
        }
      } else if (score >= 35) {
        aiSuggestion = 'Препоръчан с резерви – значителни компромиси са необходими.';
      } else {
        aiSuggestion = 'Не е препоръчан – потърсете по-подходящ вариант за вашия любимец.';
      }

      return {
        sitterId: sitter.id,
        matchPct: score,
        reasoning,
        risks,
        compatibilityScore,
        petNeedsFit,
        aiSuggestion
      };
    });

    matches.sort((a, b) => b.matchPct - a.matchPct);

    return new Response(
      JSON.stringify(matches),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in alice-match-engine:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

function getAnimalLabel(type: string): string {
  const labels: Record<string, string> = {
    dog: 'кучета',
    cat: 'котки',
    rabbit: 'зайци',
    bird: 'птици',
    small_pet: 'малки домашни любимци',
    other: 'други животни'
  };
  return labels[type] || type;
}
