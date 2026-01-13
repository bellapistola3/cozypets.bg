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
    priceRange: 'Цена според гледача'
  },
  {
    id: 'pet-sitting',
    name: 'Гледане на домашни любимци',
    icon: '🏠',
    description: 'Грижи за вашия любимец у дома докато сте в отпуска или на работа',
    priceRange: 'Цена според гледача'
  },
  {
    id: 'cat-care',
    name: 'Грижа за котки',
    icon: '🐈',
    description: 'Специализирани услуги за котки - хранене, игра и компания',
    priceRange: 'Цена според гледача'
  },
  {
    id: 'overnight-care',
    name: 'Нощувка при гледача',
    icon: '🌙',
    description: 'Вашият любимец остава при професионален гледач през нощта',
    priceRange: 'Цена според гледача'
  },
  {
    id: 'daycare',
    name: 'Дневна грижа',
    icon: '☀️',
    description: 'Цял ден грижа и забавления за вашия домашен любимец',
    priceRange: 'Цена според гледача'
  },
  {
    id: 'grooming',
    name: 'Груминг',
    icon: '✂️',
    description: 'Професионално подстригване, къпане и грижа за козината',
    priceRange: 'Цена според гледача'
  },
  {
    id: 'training',
    name: 'Обучение',
    icon: '🎓',
    description: 'Професионално обучение и дресура на вашия домашен любимец',
    priceRange: 'Цена според гледача'
  },
  {
    id: 'vet-visit',
    name: 'Придружаване до ветеринар',
    icon: '🏥',
    description: 'Транспорт и придружаване на любимеца ви до ветеринарна клиника',
    priceRange: 'Цена според гледача'
  },
  {
    id: 'pet-taxi',
    name: 'Пет такси',
    icon: '🚗',
    description: 'Безопасен транспорт на вашия домашен любимец',
    priceRange: 'Цена според гледача'
  },
  {
    id: 'home-visits',
    name: 'Посещения у дома',
    icon: '🚪',
    description: 'Кратки посещения за хранене, разходка и компания',
    priceRange: 'Цена според гледача'
  },
  {
    id: 'elderly-pet-care',
    name: 'Грижа за възрастни любимци',
    icon: '🦴',
    description: 'Специални грижи за възрастни и болни домашни любимци',
    priceRange: 'Цена според гледача'
  },
  {
    id: 'puppy-care',
    name: 'Грижа за кученца',
    icon: '🐶',
    description: 'Специализирана грижа за кученца под 1 година',
    priceRange: 'Цена според гледача'
  }
];
