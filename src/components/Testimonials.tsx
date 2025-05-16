import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import SectionHeading from './common/SectionHeading';

interface Testimonial {
  id: number;
  name: string;
  petName: string;
  petType: string;
  content: string;
  image: string;
  rating: number;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      petName: 'Max',
      petType: 'Golden Retriever',
      content: 'PawKeeper has been a lifesaver for us! Our dog Max is always excited to see his walker, and we get detailed updates after every visit. Highly recommended for busy pet parents!',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg',
      rating: 5,
    },
    {
      id: 2,
      name: 'Michael Chen',
      petName: 'Luna',
      petType: 'Maine Coon',
      content: 'I was nervous about leaving my cat alone for a business trip, but the overnight care from PawKeeper was amazing. Luna was relaxed and happy when I returned, and my sitter sent daily updates with photos.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      rating: 5,
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      petName: 'Bella & Cooper',
      petType: 'Beagle mix & Tabby cat',
      content: 'Finding someone who can handle both our dog and cat was challenging until we discovered PawKeeper. Their multi-pet sitting service is fantastic, and our pets actually seem disappointed when we come home!',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      rating: 5,
    },
    {
      id: 4,
      name: 'James Wilson',
      petName: 'Oliver',
      petType: 'French Bulldog',
      content: 'The in-home pet sitting service is perfect for our anxious Frenchie. He gets to stay in his familiar environment, and the sitter follows his routine exactly. Worth every penny for the peace of mind.',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="What Our Clients Say"
          subtitle="Trusted by hundreds of happy pet owners"
          centered
        />
        
        <div className="mt-12 relative">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="relative w-28 h-28 mx-auto md:mx-0 mb-4">
                    <img
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover rounded-full shadow-md"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full">
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-xl font-semibold mb-1">{testimonials[currentIndex].name}</h4>
                    <p className="text-gray-600 mb-2">
                      Owner of {testimonials[currentIndex].petName} ({testimonials[currentIndex].petType})
                    </p>
                    <div className="flex items-center justify-center md:justify-start">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonials[currentIndex].rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <blockquote className="text-gray-700 text-lg italic leading-relaxed">
                    "{testimonials[currentIndex].content}"
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                } transition-all duration-300`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-4 bg-white shadow-md rounded-full p-2 text-gray-700 hover:text-blue-600 transition-colors duration-300"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-4 bg-white shadow-md rounded-full p-2 text-gray-700 hover:text-blue-600 transition-colors duration-300"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;