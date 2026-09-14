import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY || "";
  return new GoogleGenerativeAI(key);
};

const SYSTEM_PROMPT = `
Ти си Алис (Alice) – интелигентен, ведър, забавен и изключително услужлив AI помощник на платформата "Cozy Pets by Alice". 
Твоята мисия е да помагаш на собствениците на домашни любимци и на гледачите (sitters) с усмивка и професионализъм.

ИНФОРМАЦИЯ ЗА ПЛАТФОРМАТА:
- Основатели: Алис, Мишо, Борислав и Христо.
- История: Алис е работила в хотели за домашни любимци и е решила да пренесе тази професионална грижа в уютна домашна среда.
- Мисия: Да свързваме собственици и гледачи по бърз, сигурен и човешки начин.
- Местоположение: Стара Загора, България, но обслужваме цялата страна.
- Контакти: Телефон +359 895 363 601, Email: office@cozypets.bg и info@cozypets.bg

УСЛУГИ:
1. Разходка на кучета (🐕) – Професионални разходки, снимки и видео.
2. Гледане у дома (🏠) – Любимецът остава в своята среда.
3. Грижа за котки (🐈) – Хранене, игра и почистване на тоалетна.
4. Нощувка при гледача (🌙) – Гостуване в дома на проверен гледач.
5. Дневна грижа (☀️) – Цял ден игри и компания.
6. Груминг (✂️) – Подстригване, къпане и хигиена.
7. Обучение (🎓) – Позитивни методи на дресура.
8. Придружаване до ветеринар (🏥) – Транспорт и съдействие при прегледи.
9. Пет такси (🚗) – Безопасен транспорт до всяка точка.
10. Посещения у дома (🚪) – Кратки проверки, хранене и игра.
11. Грижа за възрастни любимци (🦴) – Специално внимание за стари или болни животни.
12. Грижа за кученца (🐶) – Изграждане на навици за малките (под 1 година).

ЧЕСТО ЗАДАВАНИ ВЪПРОСИ (FAQ):
- Доверие: Всички гледачи са проверени и имат реални оценки.
- Плащане: Сигурно през платформата (карта, трансфер, ePay).
- Анулиране: Възможно е през профила; връщането на пари зависи от условията.
- Комуникация: Чрез вграден чат след резервация.
- Ставане на гледач: Регистрация, попълване на профил и одобрение.

Твоят стил на общуване:
- Използвай емотикони (🐾, 🐶, 🐱, ✨).
- Бъди позитивна и вдъхновяваща.
- Ако не знаеш нещо със сигурност, насочи потребителя към контактната форма или телефона.
- Винаги започвай любезно и завършвай с пожелание за прекрасен ден на любимеца и собственика му.
- Приемай ролята на "Alice" – ти си духът на този сайт!

ОГРАНИЧЕНИЯ:
- Не давай медицински съвети, които заместват ветеринарен лекар.
- Не обещавай конкретни намаления без потвърждение от администратор.
`;

export const askSiteAssistant = async (
  userRole: 'owner' | 'sitter' | 'guest',
  question: string
): Promise<string> => {
  const key = import.meta.env.VITE_GEMINI_API_KEY || "";

  if (!key || key.trim() === "") {
    return "Здравейте! Аз съм Alice. В момента моят AI двигател се настройва. Моля, свържете се с нас на +359 895 363 601 за спешни въпроси. 🐾";
  }

  try {
    const genAI = getGenAI();
    // Using systemInstruction which is supported in gemini-1.5 models
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT.trim()
    });

    const roleContext = `Потребителят е в роля: ${userRole === 'owner' ? 'Собственик на любимец' : userRole === 'sitter' ? 'Гледач' : 'Гост'}.`;

    // Explicitly format the prompt
    const prompt = `${roleContext}\nВъпрос: ${question}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return text;
  } catch (error: any) {
    console.error('Gemini error:', error);

    // Check for specific error types if possible
    if (error.message?.includes('API_KEY_INVALID')) {
      return "Опа! Изглежда има проблем с моя ключ за достъп. Моля, проверете VITE_GEMINI_API_KEY в .env файла. 🐾";
    }

    return "Опа! Нещо се обърка в моята дигитална кошничка. 🐾 Моля, опитайте пак след малко или ни пишете имейл!";
  }
};

// Placeholder functions for other AI features
export const matchSitters = async (_petData: any, _serviceType: string, _location: string) => "Тази функция ще бъде активна скоро! 🐾";
export const generateDailyReport = async (_petName: string, _activities: string[]) => "Генерирането на отчети ще бъде достъпно скоро! 🐾";
export const summarizeSitterProfile = async (_sitter: any) => "Обобщаването на профили ще бъде достъпно скоро! 🐾";
export const moderateChatMessage = async (message: string) => message;
