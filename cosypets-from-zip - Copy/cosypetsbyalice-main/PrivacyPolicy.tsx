import React from "react";

const PrivacyPolicy = () => {
  return (
    <section className="px-6 py-12 max-w-3xl mx-auto text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center">Политика за поверителност</h1>
      <p className="mb-4 italic text-sm text-center">Последна актуализация: [дата]</p>

      <p className="text-lg mb-6">
        Настоящата Политика за поверителност описва как CozyPets by Alice (наричан по-долу
        "уебсайтът") събира, обработва, съхранява и защитава лични данни на потребителите си.
        С използването на нашата платформа, вие се съгласявате с тази политика.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Какви лични данни събираме</h2>
      <ul className="list-disc list-inside text-lg space-y-2">
        <li>Име и фамилия</li>
        <li>Имейл адрес</li>
        <li>Телефонен номер</li>
        <li>Информация от заявки, резервации или комуникация</li>
        <li>IP адрес, браузър, устройство и други технически данни</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Поведение на потребителя</h2>
      <p className="text-lg mb-6">
        При регистрация или използване на платформата, вие се съгласявате да не публикувате
        невярна, подвеждаща или обидна информация, както и съдържание в нарушение на закона.
        CozyPets си запазва правото да премахва такова съдържание и да прекратява достъпа без предупреждение.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Как използваме вашите данни</h2>
      <ul className="list-disc list-inside text-lg space-y-2">
        <li>За предоставяне и подобряване на услугите</li>
        <li>За отговаряне на запитвания</li>
        <li>За изпращане на известия и информация</li>
        <li>За анализ и подобрение на сайта</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Права на потребителите</h2>
      <ul className="list-disc list-inside text-lg space-y-2">
        <li>Право на достъп и корекция</li>
        <li>Право на изтриване ("правото да бъдеш забравен")</li>
        <li>Право на ограничаване или възражение срещу обработката</li>
        <li>Право на преносимост на данните</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Бисквитки (Cookies)</h2>
      <p className="text-lg mb-6">
        Използваме бисквитки за подобряване на потребителското преживяване и анализ на трафика. Можете
        да управлявате настройките на бисквитките чрез вашия браузър.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Сигурност на данните</h2>
      <p className="text-lg mb-6">
        Използваме подходящи технически и организационни мерки за защита на личните ви данни от
        неоторизиран достъп, загуба или злоупотреба.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Контакт с нас</h2>
      <p className="text-lg mb-6">
        За въпроси относно тази политика или личните ви данни, можете да се свържете с нас на:
      </p>
      <ul className="list-inside text-lg space-y-2">
        <li>📧 Имейл: <span className="italic">[вашия имейл тук]</span></li>
        <li>🌐 Уебсайт: <span className="italic">[вашият домейн тук]</span></li>
      </ul>

      <div className="text-center mt-10">
        <a
          href="/privacy"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300"
        >
          Прочети политиката за поверителност
        </a>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
