import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  Timestamp
} from 'firebase/firestore';

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyALGTNiF9qljpi3CkoSrRqYqox_PxpOkXI",
  authDomain: "cozy-pets.firebaseapp.com",
  projectId: "cozy-pets",
  storageBucket: "cozy-pets.firebasestorage.app",
  messagingSenderId: "572303568307",
  appId: "1:572303568307:web:40a1647ac4a3836db3afc6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

console.log('====================================================');
console.log(' COSYPETS.BG - FIREBASE DATABASE 100 QUERY SIMULATION');
console.log('====================================================\n');

async function runTest() {
  const testEmail = 'dbtest_sim@cosypets.bg';
  const testPass = 'CosyPetsSim2026!';

  let userUid = '';
  try {
    const cred = await signInWithEmailAndPassword(auth, testEmail, testPass);
    userUid = cred.user.uid;
    console.log(`🔑 Authenticated successfully as test user (UID: ${userUid})`);
  } catch (err) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, testEmail, testPass);
      userUid = cred.user.uid;
      console.log(`🔑 Created and authenticated new test user (UID: ${userUid})`);
    } catch (createErr) {
      console.log('⚠️ Auth fallback notice:', createErr.message);
      userUid = 'fallback-uid';
    }
  }

  const stats = {
    totalQueries: 0,
    successfulQueries: 0,
    failedQueries: 0,
    collections: {},
    relationalChecks: [],
    logs: []
  };

  const startTime = Date.now();

  async function execQuery(name, fn) {
    stats.totalQueries++;
    const t0 = Date.now();
    try {
      const res = await fn();
      const dt = Date.now() - t0;
      stats.successfulQueries++;
      stats.logs.push({ name, status: 'OK', durationMs: dt });
      return res;
    } catch (err) {
      const dt = Date.now() - t0;
      stats.failedQueries++;
      stats.logs.push({ name, status: 'ERROR', error: err.message, durationMs: dt });
      return null;
    }
  }

  console.log('\n📝 Phase 1: Creating and Verifying User Schema Records...');

  // 1. Write User Profile
  try {
    await execQuery('Write User Profile', () => setDoc(doc(db, 'users', userUid), {
      name: 'Александър Георгиев',
      full_name: 'Александър Георгиев',
      email: testEmail,
      phone: '+359888111222',
      role: 'owner',
      created_at: Timestamp.now()
    }));
  } catch (e) { console.log('  Notice users:', e.message); }

  // 2. Write Sitter Profile
  try {
    await execQuery('Write Sitter Profile', () => setDoc(doc(db, 'sitters', userUid), {
      profile_title: 'Професионален Дого-Гледач София',
      bio: 'Грижа за кучета и котки в София с любов и отговорност',
      location: 'София',
      price_24h: 45,
      hourly_rate: 15,
      rating: 4.9,
      pet_types: ['kuche', 'kotka'],
      created_at: Timestamp.now()
    }));
  } catch (e) { console.log('  Notice sitters:', e.message); }

  // 3. Write Pet Record under /users/{uid}/pets/{petId}
  const petId = 'pet-sim-100';
  try {
    await execQuery('Write Pet Record', () => setDoc(doc(db, 'users', userUid, 'pets', petId), {
      owner_id: userUid,
      name: 'Бъди',
      type: 'kuche',
      breed: 'Голдън Ретривър',
      age: 3,
      created_at: Timestamp.now()
    }));
  } catch (e) { console.log('  Notice pets:', e.message); }

  // 4. Write Reservation Record
  const resId = 'res-sim-100';
  try {
    await execQuery('Write Reservation Record', () => setDoc(doc(db, 'reservations', resId), {
      ownerId: userUid,
      sitterId: userUid,
      petId: petId,
      startDate: Timestamp.fromDate(new Date('2026-09-10')),
      endDate: Timestamp.fromDate(new Date('2026-09-15')),
      status: 'confirmed',
      totalPrice: 225,
      created_at: Timestamp.now()
    }));
  } catch (e) { console.log('  Notice res:', e.message); }

  // 5. Write Review Record
  const revId = 'rev-sim-100';
  try {
    await execQuery('Write Review Record', () => setDoc(doc(db, 'reviews', revId), {
      sitterId: userUid,
      reviewerId: userUid,
      reservationId: resId,
      rating: 5,
      comment: 'Отлично обслужване! Бъди беше много щастлив.',
      created_at: Timestamp.now()
    }));
  } catch (e) { console.log('  Notice rev:', e.message); }

  // 6. Write Payment Record
  const payId = 'pay-sim-100';
  try {
    await execQuery('Write Payment Record', () => setDoc(doc(db, 'payments', payId), {
      userId: userUid,
      reservationId: resId,
      amount: 225,
      paymentStatus: 'completed',
      paymentMethod: 'credit_card',
      created_at: Timestamp.now()
    }));
  } catch (e) { console.log('  Notice pay:', e.message); }

  console.log('\n⚡ Phase 2: Executing 100 Realistic Production Query Workloads...');

  while (stats.totalQueries < 100) {
    const idx = stats.totalQueries + 1;
    const type = idx % 6;

    if (type === 0) {
      // 1. Public Sitters Query
      await execQuery(`Query Sitters (${idx})`, () => getDocs(collection(db, 'sitters')));
    } else if (type === 1) {
      // 2. Fetch User Profile
      await execQuery(`Fetch User Profile (${idx})`, () => getDoc(doc(db, 'users', userUid)));
    } else if (type === 2) {
      // 3. Fetch Sitter Profile
      await execQuery(`Fetch Sitter Profile (${idx})`, () => getDoc(doc(db, 'sitters', userUid)));
    } else if (type === 3) {
      // 4. Query Pets for Owner
      await execQuery(`Query User Pets (${idx})`, () => getDocs(collection(db, 'users', userUid, 'pets')));
    } else if (type === 4) {
      // 5. Query Reservations where ownerId == userUid
      await execQuery(`Query Owner Reservations (${idx})`, () =>
        getDocs(query(collection(db, 'reservations'), where('ownerId', '==', userUid)))
      );
    } else {
      // 6. Query Reviews for Sitter
      await execQuery(`Query Sitter Reviews (${idx})`, () =>
        getDocs(query(collection(db, 'reviews'), where('sitterId', '==', userUid)))
      );
    }
  }

  console.log('\n🔗 Phase 3: Validating Relational Integrity (Foreign Keys & Documents)...');

  const userDocSnap = await execQuery('Verify User Doc', () => getDoc(doc(db, 'users', userUid)));
  const sitterDocSnap = await execQuery('Verify Sitter Doc', () => getDoc(doc(db, 'sitters', userUid)));
  const petDocSnap = await execQuery('Verify Pet Doc', () => getDoc(doc(db, 'users', userUid, 'pets', petId)));
  const resDocSnap = await execQuery('Verify Res Doc', () => getDoc(doc(db, 'reservations', resId)));
  const revDocSnap = await execQuery('Verify Rev Doc', () => getDoc(doc(db, 'reviews', revId)));
  const payDocSnap = await execQuery('Verify Pay Doc', () => getDoc(doc(db, 'payments', payId)));

  const userData = (userDocSnap && userDocSnap.exists && userDocSnap.exists()) ? userDocSnap.data() : null;
  const sitterData = (sitterDocSnap && sitterDocSnap.exists && sitterDocSnap.exists()) ? sitterDocSnap.data() : null;
  const petData = (petDocSnap && petDocSnap.exists && petDocSnap.exists()) ? petDocSnap.data() : null;
  const resData = (resDocSnap && resDocSnap.exists && resDocSnap.exists()) ? resDocSnap.data() : null;
  const revData = (revDocSnap && revDocSnap.exists && revDocSnap.exists()) ? revDocSnap.data() : null;
  const payData = (payDocSnap && payDocSnap.exists && payDocSnap.exists()) ? payDocSnap.data() : null;

  // Relation 1: Reservation -> Owner, Sitter, Pet
  const resOwnerValid = resData && resData.ownerId === userUid;
  const resSitterValid = resData && resData.sitterId === userUid;
  const resPetValid = resData && resData.petId === petId;

  stats.relationalChecks.push({
    relation: 'Reservation -> (Owner UID, Sitter UID, Pet ID)',
    status: (resOwnerValid && resSitterValid && resPetValid) ? '100% VALID' : 'FAILED',
    details: `Owner: ${resOwnerValid}, Sitter: ${resSitterValid}, Pet: ${resPetValid}`
  });

  // Relation 2: Review -> Sitter, Reviewer, Reservation
  const revSitterValid = revData && revData.sitterId === userUid;
  const revReviewerValid = revData && revData.reviewerId === userUid;
  const revResValid = revData && revData.reservationId === resId;

  stats.relationalChecks.push({
    relation: 'Review -> (Sitter UID, Reviewer UID, Reservation ID)',
    status: (revSitterValid && revReviewerValid && revResValid) ? '100% VALID' : 'FAILED',
    details: `Sitter: ${revSitterValid}, Reviewer: ${revReviewerValid}, Reservation: ${revResValid}`
  });

  // Relation 3: Payment -> User, Reservation
  const payUserValid = payData && payData.userId === userUid;
  const payResValid = payData && payData.reservationId === resId;

  stats.relationalChecks.push({
    relation: 'Payment -> (User UID, Reservation ID)',
    status: (payUserValid && payResValid) ? '100% VALID' : 'FAILED',
    details: `User: ${payUserValid}, Reservation: ${payResValid}`
  });

  const totalDurationSec = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n====================================================');
  console.log(' DATABASE INTEGRITY & SIMULATION REPORT');
  console.log('====================================================');
  console.log(`Backend Database:         Firebase Firestore (${firebaseConfig.projectId})`);
  console.log(`Test Authenticated UID:   ${userUid}`);
  console.log(`Total Queries Executed:   ${stats.totalQueries}`);
  console.log(`Successful Queries:       ${stats.successfulQueries}`);
  console.log(`Failed Queries:           ${stats.failedQueries}`);
  console.log(`Total Execution Time:     ${totalDurationSec} s`);
  console.log(`Average Query Speed:      ${(totalDurationSec * 1000 / stats.totalQueries).toFixed(1)} ms/query`);
  
  console.log('\nRelational Integrity Summary:');
  for (const check of stats.relationalChecks) {
    console.log(`  - ${check.relation}: ${check.status} (${check.details})`);
  }

  process.exit(0);
}

runTest().catch(err => {
  console.error('❌ Test execution error:', err);
  process.exit(1);
});
