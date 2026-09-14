import 'package:flutter/foundation.dart';
import '../services/database_service.dart';

class GenerationProvider with ChangeNotifier {
  DatabaseService? _dbService;
  int _hashtagsGenerated = 0;
  int _captionsGenerated = 0;
  int _biosGenerated = 0;
  int _ideasGenerated = 0;
  final int _dailyLimit = 10;

  int get hashtagsGenerated => _hashtagsGenerated;
  int get captionsGenerated => _captionsGenerated;
  int get biosGenerated => _biosGenerated;
  int get ideasGenerated => _ideasGenerated;
  int get dailyLimit => _dailyLimit;
  int get totalGenerated => _hashtagsGenerated + _captionsGenerated + _biosGenerated + _ideasGenerated;
  int get remaining => _dailyLimit - totalGenerated;
  bool get hasReachedLimit => totalGenerated >= _dailyLimit;

  void updateService(DatabaseService? service) {
    _dbService = service;
    if (service != null) {
      // Logic to sync from Firestore can be added here
      _syncFromFirestore();
    }
  }

  void _syncFromFirestore() {
    if (_dbService == null) return;
    _dbService!.userData.listen((doc) {
      if (doc.exists) {
        final data = doc.data() as Map<String, dynamic>?;
        if (data != null) {
          _hashtagsGenerated = data['hashtagsGenerated'] ?? 0;
          _captionsGenerated = data['captionsGenerated'] ?? 0;
          _biosGenerated = data['biosGenerated'] ?? 0;
          _ideasGenerated = data['ideasGenerated'] ?? 0;
          notifyListeners();
        }
      }
    });
  }

  Future<void> incrementHashtags({required String platform, required dynamic input, required dynamic result}) async {
    _hashtagsGenerated++;
    if (_dbService != null) {
      await _dbService!.saveGeneration(
        type: 'hashtags',
        platform: platform,
        input: input,
        result: result,
      );
    }
    notifyListeners();
  }

  Future<void> incrementCaptions({required String platform, required dynamic input, required dynamic result}) async {
    _captionsGenerated++;
    if (_dbService != null) {
      await _dbService!.saveGeneration(
        type: 'captions',
        platform: platform,
        input: input,
        result: result,
      );
    }
    notifyListeners();
  }

  Future<void> incrementBios({required String platform, required dynamic input, required dynamic result}) async {
    _biosGenerated++;
    if (_dbService != null) {
      await _dbService!.saveGeneration(
        type: 'bios',
        platform: platform,
        input: input,
        result: result,
      );
    }
    notifyListeners();
  }

  Future<void> incrementIdeas({required String platform, required dynamic input, required dynamic result}) async {
    _ideasGenerated++;
    if (_dbService != null) {
      await _dbService!.saveGeneration(
        type: 'ideas',
        platform: platform,
        input: input,
        result: result,
      );
    }
    notifyListeners();
  }

  void resetDaily() {
    _hashtagsGenerated = 0;
    _captionsGenerated = 0;
    _biosGenerated = 0;
    _ideasGenerated = 0;
    if (_dbService != null) {
      _dbService!.resetDailyLimits();
    }
    notifyListeners();
  }
}
