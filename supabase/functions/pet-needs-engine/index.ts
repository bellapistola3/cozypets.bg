import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Pet {
  type: string;
  age?: number;
  temperament?: string;
  energyLevel?: string;
  medicalNotes?: string;
  preferences?: string;
}

interface Sitter {
  id: string;
  name: string;
  experienceYears: number;
  preferredAnimals: string[];
  certifications: string[];
  rating: number;
  reviewsCount: number;
}

interface PetNeedsResult {
  petProfile: string;
  careNeeds: string;
  riskFactors: string;
  environmentFit: string;
  personalityMatch: number;
  petFitScore: number;
  aiAdvice: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { pet, sitter }: { pet: Pet; sitter: Sitter } = await req.json();

    const temperament = pet.temperament || 'спокоен';
    const energyLevel = pet.energyLevel || 'средно';
    const age = pet.age || 3;
    const petType = pet.type;

    let petProfile = '';
    if (petType === 'dog') {
      petProfile = `Това е ${temperament} куче с ${energyLevel} енергийно ниво. `;
      if (age < 2) {
        petProfile += 'Младото куче има нужда от постоянно внимание и активни занимания. ';
      } else if (age > 8) {
        petProfile += 'По-възрастното куче предпочита спокойни разходки и предвидими рутини. ';
      }
      petProfile += 'Нуждае се от социален контакт и редовни разходки.';
    } else if (petType === 'cat') {
      petProfile = `Това е ${temperament} котка с ${energyLevel} ниво на активност. `;
      petProfile += 'Котките са независими, но също се нуждаят от внимание и стабилна среда. ';
      petProfile += 'Предпочитат спокойни пространства и предвидими рутини.';
    } else {
      petProfile = `Животното е ${temperament} и има ${energyLevel} енергийно ниво. Нуждае се от специализирана грижа и внимание.';
    }

    let careNeeds = '';
    if (petType === 'dog') {
      careNeeds = 'Изисква редовни разходки (минимум 2-3 пъти дневно), хранене по разписание, ментална стимулация и социална интеракция. ';
      if (energyLevel === 'високо') {
        careNeeds += 'Високоенергийните кучета се нуждаят от активни игри и упражнения.';
      }
    } else if (petType === 'cat') {
      careNeeds = 'Изисква редовно хранене, чиста тоалетна кутия, уважаване на личното пространство и меки моменти на внимание. Не обича шумни среди.';
    } else {
      careNeeds = 'Изисква специализирана грижа според вида на животното. Важно е да се спазват рутините.';
    }

    let riskFactors = '';
    if (temperament === 'плах') {
      riskFactors = 'Плахите животни могат да изпитат стрес в нова среда или с непознати хора. Нужен е търпелив и спокоен подход.';
    } else if (energyLevel === 'високо') {
      riskFactors = 'Високоенергийните животни могат да станат деструктивни, ако не получат достатъчно движение.';
    } else {
      riskFactors = 'Минимални рискове при правилна грижа. Важно е да се спазват рутините.';
    }
    if (pet.medicalNotes) {
      riskFactors += ` Медицински бележки: ${pet.medicalNotes}`;
    }

    let environmentFit = '';
    const hasPetExperience = sitter.preferredAnimals.includes(petType) || sitter.preferredAnimals.includes('other');

    if (hasPetExperience && sitter.experienceYears >= 3) {
      environmentFit = `${sitter.name} има отличен опит с този вид животни. `;
      if (sitter.certifications.length > 0) {
        environmentFit += 'Сертификатите гарантират професионално отношение. ';
      }
      environmentFit += 'Средата е подходяща за вашия любимец.';
    } else if (hasPetExperience) {
      environmentFit = `${sitter.name} има опит с този вид животни, но е относително нов в бранша. Препоръчва се пробна среща.';
    } else {
      environmentFit = `${sitter.name} няма специализиран опит с този вид животни. Може да има предизвикателства с грижата.';
    }

    let personalityMatch = 3;
    if (hasPetExperience && sitter.rating >= 4.7 && sitter.experienceYears >= 4) {
      personalityMatch = 5;
    } else if (hasPetExperience && sitter.rating >= 4.5) {
      personalityMatch = 4;
    } else if (!hasPetExperience || sitter.experienceYears < 2) {
      personalityMatch = 2;
    }

    let petFitScore = 50;
    if (hasPetExperience) petFitScore += 25;
    petFitScore += sitter.experienceYears * 3;
    petFitScore += (sitter.rating - 4.0) * 10;
    petFitScore += sitter.certifications.length * 5;
    if (temperament === 'плах' && sitter.experienceYears < 3) petFitScore -= 15;
    if (energyLevel === 'високо' && !hasPetExperience) petFitScore -= 20;

    petFitScore = Math.max(0, Math.min(100, Math.round(petFitScore)));

    let aiAdvice = '';
    if (petFitScore >= 85 && personalityMatch >= 4) {
      aiAdvice = 'Перфектен гледач – силна съвместимост с нуждите на вашия любимец.';
    } else if (petFitScore >= 70) {
      aiAdvice = 'Добър избор, но наблюдавайте стресовите тригери.';
    } else if (petFitScore >= 50) {
      aiAdvice = 'Приемлив, но препоръчваме пробна среща преди резервация.';
    } else {
      aiAdvice = 'Не е идеален – гледачът няма достатъчно опит с този вид животно.';
    }

    const result: PetNeedsResult = {
      petProfile,
      careNeeds,
      riskFactors,
      environmentFit,
      personalityMatch,
      petFitScore,
      aiAdvice
    };

    return new Response(
      JSON.stringify(result),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in pet-needs-engine:', error);
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
