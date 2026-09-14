import React from 'react';
import { Mail, Phone, Instagram } from 'lucide-react';
import SectionHeading from './common/SectionHeading';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    email: string;
    phone: string;
    instagram?: string;
  };
}

const Team: React.FC = () => {
  const team: TeamMember[] = [
    {
      id: 1,
      name: 'Алис Петрова',
      role: 'Основател и главен гледач на домашни любимци',
      bio: 'Алис има над 10 години опит в грижата за животни в София и е сертифицирана в първа помощ и КПР за домашни любимци. Тя основа CozyPets, за да предостави любяща, професионална грижа за домашните любимци в собствените им домове.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      social: {
        email: 'cozypetsbyalice@gmail.com',
        phone: '+359 895 363 601',
        instagram: '@alice_cozypets',
      },
    },
  ];

  return (
    <section id="team" className="py-20 bg-green-50 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Запознайте се с нашия екип"
          subtitle="Професионални любители на домашни любимци на ваше разположение"
          centered
        />

        <div className="flex justify-center mt-12">

          {team.map((member) => (
            <div key={member.id} className="interactive-card neon-glow bg-white rounded-xl shadow-md overflow-hidden w-full max-w-sm">
              <div className="h-64 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-green-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 mb-4 text-sm">{member.bio}</p>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center mb-2">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <a href={`mailto:${member.social.email}`} className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                      {member.social.email}
                    </a>
                  </div>
                  <div className="flex items-center mb-2">
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <a href={`tel:${member.social.phone}`} className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                      {member.social.phone}
                    </a>
                  </div>
                  {member.social.instagram && (
                    <div className="flex items-center">
                      <Instagram className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">{member.social.instagram}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;