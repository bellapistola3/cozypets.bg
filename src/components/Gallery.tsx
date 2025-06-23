import React, { useState } from 'react';
import SectionHeading from './common/SectionHeading';
import { X } from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState('all');

  const images: GalleryImage[] = [
    {
      id: 1,
      src: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg',
      alt: 'Dog playing in the park',
      category: 'dogs',
    },
    {
      id: 2,
      src: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg',
      alt: 'Cat relaxing on couch',
      category: 'cats',
    },
    {
      id: 3,
      src: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg',
      alt: 'Dog enjoying a walk',
      category: 'dogs',
    },
    {
      id: 4,
      src: 'https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg',
      alt: 'Cat playing with toy',
      category: 'cats',
    },
    {
      id: 5,
      src: 'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg',
      alt: 'Guinea pig eating vegetables',
      category: 'other',
    },
    {
      id: 6,
      src: 'https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg',
      alt: 'Rabbit in garden',
      category: 'other',
    },
    {
      id: 7,
      src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      alt: 'Dog with toy on grass',
      category: 'dogs',
    },
    {
      id: 8,
      src: 'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg',
      alt: 'Cat looking out window',
      category: 'cats',
    },
  ];

  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(image => image.category === filter);

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Pet Gallery"
          subtitle="Happy pets in our care"
          centered
        />
        
        <div className="flex justify-center mt-8 mb-10">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              All Pets
            </button>
            <button
              onClick={() => setFilter('dogs')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                filter === 'dogs' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              Dogs
            </button>
            <button
              onClick={() => setFilter('cats')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                filter === 'cats' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              Cats
            </button>
            <button
              onClick={() => setFilter('other')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                filter === 'other' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              Other Pets
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-900 hover:text-red-600 transition-colors duration-300 z-10"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              <p className="text-white text-center mt-4">{selectedImage.alt}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;