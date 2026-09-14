import '../services/database_service.dart';

class AuthProvider with ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  User? _user;
  bool _isLoading = false;
  DatabaseService? _dbService;

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;
  DatabaseService? get dbService => _dbService;

  AuthProvider() {
    _auth.authStateChanges().listen((User? user) {
      _user = user;
      if (user != null) {
        _dbService = DatabaseService(uid: user.uid);
      } else {
        _dbService = null;
      }
      notifyListeners();
    });
  }

  Future<void> signInAnonymously() async {
    try {
      _isLoading = true;
      notifyListeners();
      
      final credential = await _auth.signInAnonymously();
      
      if (credential.user != null) {
        _dbService = DatabaseService(uid: credential.user!.uid);
        await _dbService!.updateUserData(
          displayName: 'Guest User',
          subscriptionTier: 'free',
        );
      }
      
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> signOut() async {
    await _auth.signOut();
  }
}
