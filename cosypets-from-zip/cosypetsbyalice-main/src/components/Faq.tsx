import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface QuestionItem {
  question: string;
  answer: string;
}

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const ownerQuestions: QuestionItem[] = [
    {
      question: "Мога ли да се доверя на гледач в CozyPets?",
      answer:
        "Да! Всички гледачи преминават през проверка и имат оценки от реални потребители. Поставяме безопасността и доверието на първо място.",
    },
    {
      question: "Как се извършва плащането?",
      answer:
        "Плащанията се извършват сигурно чрез платформата. Поддържаме различни методи – карта, банков превод или мобилно плащане.",
    },
    {
      question: "Какво се случва при анулиране от моя страна?",
      answer:
        "Можеш да анулираш от профила си. Възстановяването зависи от времето на отказ и условията на гледача.",
    },
    {
      question: "А ако гледачът анулира резервацията?",
      answer:
        "Ще те уведомим и ще ти помогнем да намериш друг гледач без допълнителни разходи.",
    },
    {
      question: "Как се свързвам с гледача си?",
      answer:
        "След резервация, можеш да използваш вградената ни чат система в платформата.",
    },
  ];

  const sitterQuestions: QuestionItem[] = [
    {
      question: "Как мога да стана гледач?",
      answer:
        "Регистрирай се, попълни профила си и кандидатствай. Разглеждаме опита и мотивацията ти.",
    },
    {
      question: "Как ще получавам плащания?",
      answer:
        "Сумата се изпраща автоматично след приключване на услугата – чрез банкова сметка или ePay.",
    },
    {
      question: "Каква е типичната цена на вечер?",
      answer:
        "Зависи от типа грижа и региона. Можеш сам да зададеш цената в профила си.",
    },
    {
      question: "Какво се случва при отказ от страна на клиент?",
      answer:
        "Ще бъдеш уведомен. Можеш да получиш пълно или частично възнаграждение според условията.",
    },
    {
      question: "Има ли такси?",
      answer:
        "Да, CozyPets удържа малка комисионна за поддръжка и защита на платформата.",
    },
  ];

  const allQuestions = [
    { title: "За собственици на домашни любимци", items: ownerQuestions },
    { title: "За гледачи на домашни любимци", items: sitterQuestions },
  ];

  return (
    <section id="faq" className="bg-gray-100 py-16 px-6 scroll-mt-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10">
          Често задавани въпроси
        </h2>

        {allQuestions.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-12">
            <h3 className="text-2xl font-semibold text-green-700 mb-6">
              {group.title}
            </h3>

            {group.items.map((q, qIndex) => {
              const id = `${groupIndex}-${qIndex}`;
              const isOpen = openIndex === id;

              return (
                <div
                  key={id}
                  className="bg-white rounded-lg shadow-md mb-4 transition-all"
                >
                  <button
                    onClick={() => toggle(id)}
                    className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-800 font-medium focus:outline-none"
                  >
                    <div className="flex items-center">
                      <HelpCircle className="w-5 h-5 text-green-500 mr-2" />
                      {q.question}
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-gray-700 text-sm animate-fade-in">
                      {q.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
