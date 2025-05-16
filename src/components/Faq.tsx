import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import SectionHeading from './common/SectionHeading';

interface FaqItem {
  question: string;
  answer: string;
}

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems: FaqItem[] = [
    {
      question: 'What services do you offer?',
      answer: 'We offer a range of pet care services including daily dog walks, in-home pet sitting, overnight care, and pet taxi services. Each service can be customized to meet your pet\'s specific needs.',
    },
    {
      question: 'Are your pet sitters insured and bonded?',
      answer: 'Yes, all our pet sitters are fully insured and bonded. We also conduct thorough background checks and provide extensive training to ensure the highest quality of care for your pets.',
    },
    {
      question: 'How do I book a service?',
      answer: 'You can book our services through our online booking system. Simply click the "Book Now" button, select your desired service, and fill out the required information. We\'ll confirm your booking within 2 hours.',
    },
    {
      question: 'What happens during a meet-and-greet?',
      answer: 'During the complimentary meet-and-greet, we\'ll visit your home to meet you and your pets, review care instructions, get a copy of your house key if needed, and answer any questions you may have.',
    },
    {
      question: 'How do you handle pet emergencies?',
      answer: 'All our sitters are trained in pet first aid and CPR. In case of an emergency, we\'ll immediately contact you and your designated emergency vet, and transport your pet to receive care if necessary.',
    },
    {
      question: 'Do you provide updates during pet sitting?',
      answer: 'Yes! We send detailed updates after each visit, including photos of your pet, notes about their activities, and confirmation that all care instructions were followed.',
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about our pet care services"
          centered
        />
        
        <div className="max-w-3xl mx-auto mt-12">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-0"
            >
              <button
                className="w-full py-6 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-lg font-medium text-gray-900">{item.question}</span>
                {openIndex === index ? (
                  <Minus className="h-5 w-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <Plus className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                }`}
              >
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;