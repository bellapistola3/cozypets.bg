/*
  # Insert Test Data for CozyPets Platform

  1. Test Users
    - Pet owners
    - Pet sitters
    - Admin users

  2. Test Sitters
    - Various locations and specialties
    - Different pricing and ratings

  3. Test Pets
    - Different types and breeds
    - Various ages and characteristics

  4. Test Reservations
    - Different statuses and date ranges
    - Various service types

  5. Test Reviews
    - Different ratings and comments
    - Realistic feedback

  6. Test Payments
    - Different payment methods and statuses
*/

-- Insert test users (pet owners)
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('Елена Димитрова', 'elena@example.com', '+359888123456', '$2b$10$example_hash_1', 'owner'),
('Иван Петров', 'ivan@example.com', '+359888234567', '$2b$10$example_hash_2', 'owner'),
('Мария Георгиева', 'maria@example.com', '+359888345678', '$2b$10$example_hash_3', 'owner'),
('Георги Стоянов', 'georgi@example.com', '+359888456789', '$2b$10$example_hash_4', 'owner'),
('Анна Николова', 'anna@example.com', '+359888567890', '$2b$10$example_hash_5', 'owner');

-- Insert test users who will become sitters
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('Мария Петкова', 'maria.sitter@example.com', '+359888111111', '$2b$10$example_hash_6', 'owner'),
('Христо Димитров', 'hristo.sitter@example.com', '+359888222222', '$2b$10$example_hash_7', 'owner'),
('Борислав Иванов', 'boris.sitter@example.com', '+359888333333', '$2b$10$example_hash_8', 'owner'),
('Петя Василева', 'petya.sitter@example.com', '+359888444444', '$2b$10$example_hash_9', 'owner'),
('Стефан Тодоров', 'stefan.sitter@example.com', '+359888555555', '$2b$10$example_hash_10', 'owner');

-- Insert admin user
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('Алис Петрова', 'admin@cozypets.bg', '+359895888260', '$2b$10$example_hash_admin', 'admin');

-- Insert test sitters
INSERT INTO sitters (user_id, bio, photo_url, hourly_rate, location, qualifications, rating) VALUES
(6, 'Обожавам животните и имам над 5 години опит в грижата за домашни любимци. Специализирам се в грижата за кучета от всички размери.', 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg', 25.00, 'София, кв. Лозенец', 'Сертифициран гледач, първа помощ за животни', 4.9),
(7, 'Ветеринарен асистент с опит в грижата за домашни любимци с медицински нужди. Специалист по поведение на котки.', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', 30.00, 'Пловдив, Център', 'Ветеринарен асистент, специализация възрастни животни', 5.0),
(8, 'Енергичен специалист по разходки с кучета. Планинар с опит в дългите разходки и упражнения за активни кучета.', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg', 20.00, 'София, кв. Младост', 'Инструктор по кучешки спорт, 3 години опит', 4.7),
(9, 'Грижовна и отговорна гледачка с опит в домашното гледане. Обичам да прекарвам време с домашните любимци в тяхната среда.', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg', 22.00, 'Варна, Център', 'Сертификат за грижа за домашни любимци', 4.8),
(10, 'Специалист по грижа за екзотични животни - птици, зайци, хамстери. Имам опит с различни видове домашни любимци.', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg', 28.00, 'Бургас, Център', 'Специализация екзотични животни', 4.6);

-- Insert test pets
INSERT INTO pets (user_id, name, breed, age, health_status, photo_url) VALUES
(1, 'Макс', 'Голдън ретрийвър', 3, 'Здрав, алергичен към пилешко месо', 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg'),
(1, 'Луна', 'Персийска котка', 2, 'Здрава', 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg'),
(2, 'Рекс', 'Немска овчарка', 5, 'Здрав, нуждае се от много упражнения', 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg'),
(3, 'Мила', 'Британска късокосместа котка', 4, 'Здрава, малко свенлива', 'https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg'),
(4, 'Бъди', 'Лабрадор микс', 2, 'Здрав, много енергичен', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'),
(5, 'Снежко', 'Заек', 1, 'Здрав', 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg');

-- Insert test reservations
INSERT INTO reservations (owner_id, sitter_id, pet_id, start_date, end_date, total_price, status) VALUES
(1, 1, 1, '2024-02-01 09:00:00', '2024-02-05 18:00:00', 500.00, 'completed'),
(2, 2, 3, '2024-02-10 08:00:00', '2024-02-12 20:00:00', 360.00, 'completed'),
(3, 3, 4, '2024-02-15 10:00:00', '2024-02-15 16:00:00', 120.00, 'confirmed'),
(1, 4, 2, '2024-02-20 09:00:00', '2024-02-22 18:00:00', 264.00, 'pending'),
(4, 1, 5, '2024-02-25 08:00:00', '2024-02-28 19:00:00', 750.00, 'confirmed'),
(5, 5, 6, '2024-03-01 10:00:00', '2024-03-03 16:00:00', 336.00, 'pending');

-- Insert test reviews
INSERT INTO reviews (reservation_id, reviewer_id, sitter_id, rating, comment) VALUES
(1, 1, 1, 5, 'Мария беше невероятна с нашето куче Макс! Той се върна щастлив и уморен след всяка разходка. Получавахме подробни актуализации със снимки. Определено ще резервираме отново.'),
(2, 2, 2, 5, 'Христо беше професионален и грижовен с Рекс. Като ветеринарен асистент, той знаеше точно как да се справи с енергичното ни куче. Отличен сервис!'),
(1, 1, 1, 5, 'Втори път ползваме услугите на Мария и отново сме изключително доволни. Макс я обожава и винаги се радва да я види.');

-- Insert test payments
INSERT INTO payments (reservation_id, amount, payment_method, payment_status) VALUES
(1, 500.00, 'credit_card', 'completed'),
(2, 360.00, 'paypal', 'completed'),
(3, 120.00, 'credit_card', 'completed'),
(4, 264.00, 'bank_transfer', 'pending'),
(5, 750.00, 'credit_card', 'pending');

-- Update sitter ratings based on reviews
UPDATE sitters SET rating = (
  SELECT AVG(rating::DECIMAL) 
  FROM reviews 
  WHERE reviews.sitter_id = sitters.sitter_id
) WHERE sitter_id IN (SELECT DISTINCT sitter_id FROM reviews);