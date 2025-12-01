export interface ServiceType {
  id: string;
  name: string;
  icon: string;
  description: string;
  priceRange: string;
}

export const servicesList: ServiceType[] = [
  {
    id: 'dog-walking',
    name: 'Разходка на кучета',
    icon: '🐕',
    description: 'Професионални разходки за вашето куче с опитни любители на животни',
    priceRange: '15-30 лв/час'
  },
  {
    id: 'pet-sitting',
    name: 'Гледане на домашни любимци',
    icon: '🏠',
    description: 'Грижи за вашия любимец у дома докато сте в отпуска или на работа',
    priceRange: '25-50 лв/ден'
  },
  {
    id: 'cat-care',
    name: 'Грижа за котки',
    icon: '🐈',
    description: 'Специализирани услуги за котки - хранене, игра и компания',
    priceRange: '20-40 лв/ден'
  },
  {
    id: 'overnight-care',
    name: 'Нощувка при гледача',
    icon: '🌙',
    description: 'Вашият любимец остава при професионален гледач през нощта',
    priceRange: '40-80 лв/нощ'
  },
  {
    id: 'daycare',
    name: 'Дневна грижа',
    icon: '☀️',
    description: 'Цял ден грижа и забавления за вашия домашен любимец',
    priceRange: '30-60 лв/ден'
  },
  {
    id: 'grooming',
    name: 'Груминг',
    icon: '✂️',
    description: 'Професионално подстригване, къпане и грижа за козината',
    priceRange: '40-100 лв'
  },
  {
    id: 'training',
    name: 'Обучение',
    icon: '🎓',
    description: 'Професионално обучение и дресура на вашия домашен любимец',
    priceRange: '50-120 лв/сесия'
  },
  {
    id: 'vet-visit',
    name: 'Придружаване до ветеринар',
    icon: '🏥',
    description: 'Транспорт и придружаване на любимеца ви до ветеринарна клиника',
    priceRange: '20-40 лв'
  },
  {
    id: 'pet-taxi',
    name: 'Пет такси',
    icon: '🚗',
    description: 'Безопасен транспорт на вашия домашен любимец',
    priceRange: '15-50 лв'
  },
  {
    id: 'home-visits',
    name: 'Посещения у дома',
    icon: '🚪',
    description: 'Кратки посещения за хранене, разходка и компания',
    priceRange: '15-30 лв/посещение'
  },
  {
    id: 'elderly-pet-care',
    name: 'Грижа за възрастни любимци',
    icon: '🦴',
    description: 'Специални грижи за възрастни и болни домашни любимци',
    priceRange: '30-70 лв/ден'
  },
  {
    id: 'puppy-care',
    name: 'Грижа за кученца',
    icon: '🐶',
    description: 'Специализирана грижа за кученца под 1 година',
    priceRange: '35-65 лв/ден'
  }
];
