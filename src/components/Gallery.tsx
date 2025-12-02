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
      alt: 'Куче си играе в парка',
      category: 'dogs',
    },
    {
      id: 2,
      src: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg',
      alt: 'Котка си почива на дивана',
      category: 'cats',
    },
    {
      id: 3,
      src: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg',
      alt: 'Куче се наслаждава на разходка',
      category: 'dogs',
    },
    {
      id: 4,
      src: 'https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg',
      alt: 'Котка си играе с играчка',
      category: 'cats',
    },
    {
      id: 5,
      src: 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg',
      alt: 'Красив заек в градината',
      category: 'rabbits',
    },
    {
      id: 6,
      src: 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg',
      alt: 'Цветен папагал на клонка',
      category: 'birds',
    },
    {
      id: 7,
      src: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      alt: 'Куче с играчка на тревата',
      category: 'dogs',
    },
    {
      id: 8,
      src: 'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg',
      alt: 'Котка гледа през прозореца',
      category: 'cats',
    },
    {
      id: 9,
      src: 'https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg',
      alt: 'Сладко зайче в тревата',
      category: 'rabbits',
    },
    {
      id: 10,
      src: 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg',
      alt: 'Котенце с красиви очи',
      category: 'cats',
    },
    {
      id: 11,
      src: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
      alt: 'Щастливо кученце на трева',
      category: 'dogs',
    },
    {
      id: 12,
      src: 'https://images.pexels.com/photos/2317904/pexels-photo-2317904.jpeg',
      alt: 'Красив папагал със сини пера',
      category: 'birds',
    },
    {
      id: 13,
      src: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg',
      alt: 'Малко котенце се разхожда',
      category: 'cats',
    },
    {
      id: 14,
      src: 'https://images.pexels.com/photos/1619690/pexels-photo-1619690.jpeg',
      alt: 'Енергично кученце се играе',
      category: 'dogs',
    },
    {
      id: 15,
      src: 'https://images.pexels.com/photos/3629227/pexels-photo-3629227.jpeg',
      alt: 'Пушено зайче в кошница',
      category: 'rabbits',
    },
    {
      id: 16,
      src: 'https://images.pexels.com/photos/1599452/pexels-photo-1599452.jpeg',
      alt: 'Цветен папагал Ара',
      category: 'birds',
    },
  ];

  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(image => image.category === filter);

  return (
    <section id="gallery" className="py-20 bg-white scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Галерия с домашни любимци"
          subtitle="Щастливи домашни любимци под наша грижа"
          centered
        />
        
        <div className="flex justify-center mt-8 mb-10">
          <div className="flex flex-wrap justify-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`interactive-button px-6 py-3 rounded-lg font-semibold ${
                filter === 'all'
                  ? 'neon-glow bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              Всички
            </button>
            <button
              onClick={() => setFilter('dogs')}
              className={`interactive-button px-6 py-3 rounded-lg font-semibold ${
                filter === 'dogs'
                  ? 'neon-glow bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              Кучета
            </button>
            <button
              onClick={() => setFilter('cats')}
              className={`interactive-button px-6 py-3 rounded-lg font-semibold ${
                filter === 'cats'
                  ? 'neon-glow bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              Котки
            </button>
            <button
              onClick={() => setFilter('rabbits')}
              className={`interactive-button px-6 py-3 rounded-lg font-semibold ${
                filter === 'rabbits'
                  ? 'neon-glow bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              Зайци
            </button>
            <button
              onClick={() => setFilter('birds')}
              className={`interactive-button px-6 py-3 rounded-lg font-semibold ${
                filter === 'birds'
                  ? 'neon-glow bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              Птици
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="interactive-card neon-glow aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer"
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
                aria-label="Затвори модал"
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