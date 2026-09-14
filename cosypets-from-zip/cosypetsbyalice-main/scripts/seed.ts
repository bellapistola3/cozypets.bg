/**
 * Firebase Database Seed Script
 * Попълва базата данни с тестови данни
 */

import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    Timestamp,
} from 'firebase/firestore';
import {
    getAuth,
    createUserWithEmailAndPassword,
} from 'firebase/auth';

// Firebase конфигурация
const firebaseConfig = {
    apiKey: "AIzaSyALGTNif9qljpi3CkoSrRqYqox_PxpOkXI",
    authDomain: "cozy-pets.firebaseapp.com",
    projectId: "cozy-pets",
    storageBucket: "cozy-pets.firebasestorage.app",
    messagingSenderId: "572303568307",
    appId: "1:572303568307:web:40a1647ac4a3836db3afc6"
};

// Инициализация
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Тестови потребители
const testUsers = [
    {
        id: 'user-1',
        email: 'alice@example.com',
        password: 'password123',
        name: 'Алис Петрова',
        phone: '+359888123456',
        role: 'owner' as const
    },
    {
        id: 'user-2',
        email: 'bob@example.com',
        password: 'password123',
        name: 'Боб Иванов',
        phone: '+359888234567',
        role: 'owner' as const
    },
    {
        id: 'user-3',
        email: 'carol@example.com',
        password: 'password123',
        name: 'Кароли Георгиева',
        phone: '+359888345678',
        role: 'sitter' as const
    },
    {
        id: 'admin-1',
        email: 'admin@cosypets.bg',
        password: 'adminpassword123',
        name: 'Администратор',
        phone: '+359888999999',
        role: 'admin' as const
    }
];

// Тестови гледачи (sitters)
const testSitters = [
    {
        id: 'user-3',
        profile_title: 'Професионален Dog Sitter',
        bio: 'Имам над 5 години опит в грижата за кучета от всякакви породи. Обичам животните и се отнасям към тях като към моите собствени.',
        experience: '5+ години',
        address_line: 'ул. Витоша 15, София',
        location: 'София',
        lat: 42.6977,
        lng: 23.3219,
        is_hotel: false,
        price_24h: 50,
        hourly_rate: 15,
        price_notes: 'Включва разходки 3 пъти на ден',
        pet_types: ['kuche', 'kotka'],
        allow_small_dogs: true,
        allow_large_dogs: true,
        accept_in_heat: false,
        accept_unneutered: true,
        behavior_trainer: true,
        has_car: true,
        medical_training: 'Първа помощ за животни',
        day_flow_short: 'Разходки сутрин, обяд и вечер. Игра и грижа през целия ден.',
        rating: 4.8,
        reviews_count: 24
    },
    {
        id: 'sitter-2',
        profile_title: 'Cat Lover - Специалист Котки',
        bio: 'Обожавам котките и имам опит с всички породи. Предлагам луксозен хотел за котки с индивидуални стаи.',
        experience: '3 години',
        address_line: 'ул. Оборище 42, София',
        location: 'София',
        lat: 42.7000,
        lng: 23.3300,
        is_hotel: true,
        price_24h: 40,
        hourly_rate: 12,
        price_notes: 'Включва премиум храна и играчки',
        pet_types: ['kotka'],
        allow_small_dogs: false,
        allow_large_dogs: false,
        accept_in_heat: true,
        accept_unneutered: true,
        behavior_trainer: false,
        has_car: false,
        medical_training: '',
        day_flow_short: 'Индивидуална грижа, игра и ласки през целия ден.',
        rating: 4.9,
        reviews_count: 18
    },
    {
        id: 'sitter-3',
        profile_title: 'Pet Hotel Варна',
        bio: 'Семеен хотел за домашни любимци във Варна. Голям двор и професионална грижа.',
        experience: '10+ години',
        address_line: 'ул. Приморска 88, Варна',
        location: 'Варна',
        lat: 43.2141,
        lng: 27.9147,
        is_hotel: true,
        price_24h: 60,
        hourly_rate: 18,
        price_notes: 'Включва храна, разходки и грижа',
        pet_types: ['kuche', 'kotka', 'zaek', 'papagal'],
        allow_small_dogs: true,
        allow_large_dogs: true,
        accept_in_heat: true,
        accept_unneutered: true,
        behavior_trainer: true,
        has_car: true,
        medical_training: 'Сертифициран ветеринарен асистент',
        day_flow_short: 'Професионална грижа 24/7 с видео наблюдение.',
        rating: 5.0,
        reviews_count: 42
    },
    {
        id: 'sitter-4',
        profile_title: 'Dog Walking Expert',
        bio: 'Специализирам в разходки на кучета. Обичам дългите разходки в парка.',
        experience: '2 години',
        address_line: 'ул. Гладстон 12, София',
        location: 'София',
        lat: 42.6950,
        lng: 23.3200,
        is_hotel: false,
        price_24h: 35,
        hourly_rate: 10,
        price_notes: 'Разходки до 2 часа',
        pet_types: ['kuche'],
        allow_small_dogs: true,
        allow_large_dogs: true,
        accept_in_heat: false,
        accept_unneutered: true,
        behavior_trainer: false,
        has_car: false,
        medical_training: '',
        day_flow_short: 'Енергични разходки в парка.',
        rating: 4.6,
        reviews_count: 15
    }
];

// Тестови домашни любимци
const testPets = [
    {
        id: 'pet-1',
        owner_id: 'user-1',
        name: 'Макс',
        type: 'kuche',
        breed: 'Лабрадор',
        age: 3,
        weight: 30,
        gender: 'male',
        is_neutered: true,
        medical_notes: 'Алергия към пилешко месо',
        behavior_notes: 'Много приятелски настроен',
        photo_url: ''
    },
    {
        id: 'pet-2',
        owner_id: 'user-1',
        name: 'Луна',
        type: 'kotka',
        breed: 'Персийска',
        age: 2,
        weight: 4,
        gender: 'female',
        is_neutered: true,
        medical_notes: '',
        behavior_notes: 'Спокойна и мила',
        photo_url: ''
    },
    {
        id: 'pet-3',
        owner_id: 'user-2',
        name: 'Рекс',
        type: 'kuche',
        breed: 'Немска овчарка',
        age: 5,
        weight: 35,
        gender: 'male',
        is_neutered: false,
        medical_notes: 'Проблеми със ставите',
        behavior_notes: 'Добре обучен, но може да е притеснителен с непознати',
        photo_url: ''
    }
];

// Тестови резервации
const testReservations = [
    {
        id: 'res-1',
        owner_id: 'user-1',
        sitter_id: 'user-3',
        pet_id: 'pet-1',
        start_date: '2024-02-15',
        end_date: '2024-02-20',
        status: 'confirmed',
        total_price: 250,
        notes: 'Моля да обърнете внимание на алергията',
        payment_status: 'paid',
        created_at: Timestamp.now()
    },
    {
        id: 'res-2',
        owner_id: 'user-1',
        sitter_id: 'sitter-2',
        pet_id: 'pet-2',
        start_date: '2024-03-01',
        end_date: '2024-03-05',
        status: 'pending',
        total_price: 160,
        notes: 'Луна обича да спи много',
        payment_status: 'pending',
        created_at: Timestamp.now()
    },
    {
        id: 'res-3',
        owner_id: 'user-2',
        sitter_id: 'sitter-3',
        pet_id: 'pet-3',
        start_date: '2024-01-10',
        end_date: '2024-01-15',
        status: 'completed',
        total_price: 300,
        notes: '',
        payment_status: 'paid',
        created_at: Timestamp.fromDate(new Date('2024-01-05'))
    }
];

// Тестови отзиви
const testReviews = [
    {
        id: 'review-1',
        sitter_id: 'user-3',
        user_id: 'user-1',
        reservation_id: 'res-1',
        rating: 5,
        comment: 'Страхотна грижа за Макс! Много съм доволна и ще резервирам отново.',
        created_at: Timestamp.fromDate(new Date('2024-02-21'))
    },
    {
        id: 'review-2',
        sitter_id: 'user-3',
        user_id: 'user-2',
        reservation_id: 'res-3',
        rating: 4,
        comment: 'Добра услуга, но бих искал повече снимки по време на престоя.',
        created_at: Timestamp.fromDate(new Date('2024-01-16'))
    },
    {
        id: 'review-3',
        sitter_id: 'sitter-2',
        user_id: 'user-1',
        reservation_id: 'res-2',
        rating: 5,
        comment: 'Луна беше много щастлива! Препоръчвам топло.',
        created_at: Timestamp.fromDate(new Date('2024-03-06'))
    },
    {
        id: 'review-4',
        sitter_id: 'sitter-3',
        user_id: 'user-2',
        reservation_id: 'res-3',
        rating: 5,
        comment: 'Перфектно! Професионалисти.',
        created_at: Timestamp.fromDate(new Date('2024-01-16'))
    }
];

// Тестови плащания
const testPayments = [
    {
        id: 'pay-1',
        reservation_id: 'res-1',
        user_id: 'user-1',
        amount: 250,
        paymentStatus: 'completed',
        paymentMethod: 'paypal',
        created_at: Timestamp.fromDate(new Date('2024-02-14'))
    },
    {
        id: 'pay-3',
        reservation_id: 'res-3',
        user_id: 'user-2',
        amount: 300,
        paymentStatus: 'completed',
        paymentMethod: 'card',
        created_at: Timestamp.fromDate(new Date('2024-01-09'))
    }
];

async function seedDatabase() {
    console.log('🌱 Започване на seed процес...');

    try {
        // 1. Създаване на потребители
        console.log('\n👤 Създаване на потребители...');
        for (const user of testUsers) {
            try {
                // Не създаваме Auth потребители, защото това може да доведе до проблеми
                // Вместо това, просто създаваме профилите в Firestore
                const userRef = doc(db, 'users', user.id);
                await setDoc(userRef, {
                    name: user.name,
                    full_name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    created_at: Timestamp.now()
                });
                console.log(`   ✓ ${user.name} (${user.email})`);
            } catch (error: any) {
                console.log(`   ⚠ ${user.email}: ${error.message}`);
            }
        }

        // 2. Създаване на гледачи
        console.log('\n🐕 Създаване на гледачи...');
        for (const sitter of testSitters) {
            const sitterRef = doc(db, 'sitters', sitter.id);
            await setDoc(sitterRef, {
                ...sitter,
                created_at: Timestamp.now()
            });
            console.log(`   ✓ ${sitter.profile_title} (${sitter.location})`);
        }

        // 3. Създаване на домашни любимци
        console.log('\n🐾 Създаване на домашни любимци...');
        for (const pet of testPets) {
            const petRef = doc(db, 'pets', pet.id);
            await setDoc(petRef, {
                ...pet,
                created_at: Timestamp.now()
            });
            console.log(`   ✓ ${pet.name} (${pet.type})`);
        }

        // 4. Създаване на резервации
        console.log('\n📅 Създаване на резервации...');
        for (const reservation of testReservations) {
            const resRef = doc(db, 'reservations', reservation.id);
            await setDoc(resRef, reservation);
            console.log(`   ✓ Резервация ${reservation.id} (${reservation.status})`);
        }

        // 5. Създаване на отзиви
        console.log('\n⭐ Създаване на отзиви...');
        for (const review of testReviews) {
            const reviewRef = doc(db, 'reviews', review.id);
            await setDoc(reviewRef, review);
            console.log(`   ✓ Отзив от ${review.user_id} за ${review.sitter_id}`);
        }

        // 6. Създаване на плащания
        console.log('\n💳 Създаване на плащания...');
        for (const payment of testPayments) {
            const payRef = doc(db, 'payments', payment.id);
            await setDoc(payRef, payment);
            console.log(`   ✓ Плащане ${payment.id} (${payment.amount} лв.)`);
        }

        console.log('\n✅ Seed процесът завърши успешно!');
        console.log('\n📊 Статистика:');
        console.log(`   - Потребители: ${testUsers.length}`);
        console.log(`   - Гледачи: ${testSitters.length}`);
        console.log(`   - Домашни любимци: ${testPets.length}`);
        console.log(`   - Резервации: ${testReservations.length}`);
        console.log(`   - Отзиви: ${testReviews.length}`);
        console.log(`   - Плащания: ${testPayments.length}`);

        console.log('\n🎉 Базата данни е готова за тестване!');
        console.log('💡 Може да използвате DatabaseTest компонента за проверка.');

    } catch (error) {
        console.error('❌ Грешка при seed процес:', error);
        throw error;
    }
}

// Стартиране
seedDatabase()
    .then(() => {
        console.log('\n👋 Готово!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Критична грешка:', error);
        process.exit(1);
    });
