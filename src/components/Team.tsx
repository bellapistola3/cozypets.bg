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
      name: 'Jessica Williams',
      role: 'Founder & Head Pet Sitter',
      bio: 'Jessica has over 10 years of experience in animal care and is certified in pet first aid and CPR. She founded PawKeeper to provide loving, professional care to pets in their own homes.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      social: {
        email: 'jessica@pawkeeper.com',
        phone: '(555) 123-4567',
        instagram: '@jessica_pawkeeper',
      },
    },
    {
      id: 2,
      name: 'David Miller',
      role: 'Senior Pet Care Specialist',
      bio: 'With a background in veterinary assistance, David specializes in caring for pets with medical needs. He\'s known for his calm demeanor and ability to win over even the most anxious pets.',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      social: {
        email: 'david@pawkeeper.com',
        phone: '(555) 234-5678',
        instagram: '@david_petcare',
      },
    },
    {
      id: 3,
      name: 'Maria Garcia',
      role: 'Dog Walking Coordinator',
      bio: 'Maria is our energetic dog walking specialist who manages our team of walkers. She\'s an avid hiker and ensures all our dogs get the perfect amount of exercise and enrichment.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      social: {
        email: 'maria@pawkeeper.com',
        phone: '(555) 345-6789',
      },
    },
    {
      id: 4,
      name: 'Robert Chen',
      role: 'Cat Behavior Specialist',
      bio: 'Robert has a special way with cats and understands their unique needs. He\'s trained in feline behavior and can help with everything from playtime enrichment to medication administration.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      social: {
        email: 'robert@pawkeeper.com',
        phone: '(555) 456-7890',
        instagram: '@robert_catwhisperer',
      },
    },
  ];

  return (
    <section id="team" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Meet Our Team"
          subtitle="Professional pet lovers at your service"
          centered
        />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {team.map((member) => (
            <div key={member.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="h-64 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 mb-4 text-sm">{member.bio}</p>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center mb-2">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <a href={`mailto:${member.social.email}`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {member.social.email}
                    </a>
                  </div>
                  <div className="flex items-center mb-2">
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <a href={`tel:${member.social.phone}`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
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