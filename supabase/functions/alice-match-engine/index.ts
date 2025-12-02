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
        const distanceBonus = Math.max(0, 20 - sitter.distanceKm * 2);
        score += distanceBonus;
        if (sitter.distanceKm < 3) {
          reasoningPoints.push(`Много близко до вас (${sitter.distanceKm} км)`);
        }
      } else {
        score -= 30;
        riskPoints.push(`Извън желаното разстояние (${sitter.distanceKm} км)`);
      }

      if (filters.animalType !== 'any') {
        if (sitter.preferredAnimals.includes(filters.animalType)) {
          score += 15;
          reasoningPoints.push(`Специализиран в грижа за ${getAnimalLabel(filters.animalType)}`);
        } else {
          score -= 20;
          riskPoints.push(`Няма опит с ${getAnimalLabel(filters.animalType)}`);
        }
      }

      if (filters.minPrice !== null || filters.maxPrice !== null) {
        const minP = filters.minPrice || 0;
        const maxP = filters.maxPrice || Infinity;
        if (sitter.pricePerHour >= minP && sitter.pricePerHour <= maxP) {
          score += 10;
          if (sitter.pricePerHour < 15) {
            reasoningPoints.push('Отлична цена');
          }
        } else {
          score -= 15;
          if (sitter.pricePerHour > maxP) {
            riskPoints.push(`Цената (${sitter.pricePerHour} лв/час) е над вашия бюджет`);
          }
        }
      }

      if (filters.minExperienceYears !== null && sitter.experienceYears >= filters.minExperienceYears) {
        score += 10;
        if (sitter.experienceYears >= 5) {
          reasoningPoints.push(`Богат опит (${sitter.experienceYears}+ години)`);
        }
      } else if (filters.minExperienceYears !== null) {
        score -= 10;
      }

      if (filters.onlyCertified) {
        if (sitter.certifications.length > 0) {
          score += 15;
          reasoningPoints.push(`Има ${sitter.certifications.length} сертификат(а)`);
        } else {
          score -= 25;
          riskPoints.push('Няма сертификати');
        }
      } else if (sitter.certifications.length > 0) {
        score += 8;
      }

      if (filters.availability.length > 0) {
        const matchingAvailability = filters.availability.filter(a => 
          sitter.availabilityTags.includes(a)
        );
        if (matchingAvailability.length === filters.availability.length) {
          score += 12;
          reasoningPoints.push('Напълно налична за вашите нужди');
        } else if (matchingAvailability.length > 0) {
          score += 5;
        } else {
          score -= 15;
          riskPoints.push('Ограничена наличност за вашите предпочитания');
        }
      }

      const ratingBonus = (sitter.rating - 3) * 5;
      score += ratingBonus;
      if (sitter.rating >= 4.8) {
        reasoningPoints.push(`Отличен рейтинг (${sitter.rating}⭐)`);
      }

      const reviewBonus = Math.min(10, sitter.reviewsCount / 5);
      score += reviewBonus;
      if (sitter.reviewsCount > 30) {
        reasoningPoints.push(`Много положителни отзиви (${sitter.reviewsCount})`);
      } else if (sitter.reviewsCount < 10) {
        riskPoints.push('Малко отзиви от клиенти');
      }

      score = Math.max(0, Math.min(100, Math.round(score)));

      let reasoning = '';
      if (reasoningPoints.length > 0) {
        reasoning = `${sitter.name} е отличен избор, защото: ${reasoningPoints.slice(0, 3).join(', ')}. `;
      } else {
        reasoning = `${sitter.name} е приемлив избор за вашите нужди. `;
      }
      reasoning += `С рейтинг ${sitter.rating} и ${sitter.reviewsCount} отзива, ${sitter.name.split(' ')[0]} показва професионализъм и отдаденост.`;

      let risks = '';
      if (riskPoints.length > 0) {
        risks = `Обърнете внимание: ${riskPoints.join('; ')}.`;
      } else {
        risks = 'Няма значителни рискове. Отличен избор за вашия любимец.';
      }

      const compatibilityScore = score >= 80 ? 5 : score >= 65 ? 4 : score >= 50 ? 3 : score >= 35 ? 2 : 1;

      return {
        sitterId: sitter.id,
        matchPct: score,
        reasoning,
        risks,
        compatibilityScore
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
    other: 'други животни'
  };
  return labels[type] || type;
}
