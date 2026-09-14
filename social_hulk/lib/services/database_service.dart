import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class DatabaseService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final String _uid;

  DatabaseService({required String uid}) : _uid = uid;

  // USER PROFILE
  Future<void> updateUserData({
    String? email,
    String? displayName,
    String? subscriptionTier,
  }) async {
    return await _db.collection('users').doc(_uid).set({
      'email': email,
      'displayName': displayName,
      'subscriptionTier': subscriptionTier ?? 'free',
      'lastActive': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));
  }

  Stream<DocumentSnapshot> get userData {
    return _db.collection('users').doc(_uid).snapshots();
  }

  // GENERATIONS
  Future<void> saveGeneration({
    required String type,
    required String platform,
    required dynamic input,
    required dynamic result,
  }) async {
    // Add to history
    await _db.collection('users').doc(_uid).collection('generations').add({
      'type': type,
      'platform': platform,
      'input': input,
      'result': result,
      'createdAt': FieldValue.serverTimestamp(),
    });

    // Update usage counters for today
    await _updateUsageCounters(type);
  }

  Future<void> _updateUsageCounters(String type) async {
    final docRef = _db.collection('users').doc(_uid);
    
    // Increment specific type and total
    await docRef.update({
      '${type}Generated': FieldValue.increment(1),
      'totalGenerations': FieldValue.increment(1),
      'lastUpdate': FieldValue.serverTimestamp(),
    });
  }

  // Reset daily limits (can be called on app start if date changed)
  Future<void> resetDailyLimits() async {
    await _db.collection('users').doc(_uid).update({
      'hashtagsGenerated': 0,
      'captionsGenerated': 0,
      'biosGenerated': 0,
      'ideasGenerated': 0,
      'lastResetDate': FieldValue.serverTimestamp(),
    });
  }

  // Fetch generation history
  Stream<QuerySnapshot> get generationHistory {
    return _db
        .collection('users')
        .doc(_uid)
        .collection('generations')
        .orderBy('createdAt', descending: true)
        .limit(50)
        .snapshots();
  // SEARCH USERS
  Future<List<Map<String, dynamic>>> searchUsers(String query) async {
    final snapshot = await _db
        .collection('users')
        .where('displayName', isGreaterThanOrEqualTo: query)
        .where('displayName', isLessThanOrEqualTo: query + '\uf8ff')
        .limit(20)
        .get();

    return snapshot.docs
        .map((doc) => {...doc.data(), 'id': doc.id})
        .toList();
  }

  // GLOBAL STATS (For Admin)
  Stream<Map<String, dynamic>> get globalStats {
    return _db.collection('stats').doc('platform').snapshots().map((doc) {
      return doc.data() as Map<String, dynamic>? ?? {};
    });
  }
}
