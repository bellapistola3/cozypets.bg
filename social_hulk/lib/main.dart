import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'config/firebase_config.dart';
import 'providers/auth_provider.dart';
import 'providers/generation_provider.dart';
import 'screens/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase
  await Firebase.initializeApp(
    options: const FirebaseOptions(
      apiKey: FirebaseConfig.apiKey,
      authDomain: FirebaseConfig.authDomain,
      projectId: FirebaseConfig.projectId,
      storageBucket: FirebaseConfig.storageBucket,
      messagingSenderId: FirebaseConfig.messagingSenderId,
      appId: FirebaseConfig.appId,
    ),
  );
  
  runApp(const SocialHulkApp());
}

class SocialHulkApp extends StatelessWidget {
  const SocialHulkApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProxyProvider<AuthProvider, GenerationProvider>(
          create: (_) => GenerationProvider(),
          update: (_, auth, generation) => generation!..updateService(auth.dbService),
        ),
      ],
      child: MaterialApp(
        title: 'Social Hulk',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          brightness: Brightness.dark,
          colorScheme: ColorScheme.dark(
            primary: Color(0xFF6C5CE7), // Purple
            secondary: Color(0xFF00B894), // Green
            tertiary: Color(0xFFFDCB6E), // Gold
            background: Color(0xFF2D3436),
            surface: Color(0xFF353B48),
          ),
          fontFamily: 'Inter',
        ),
        home: const SplashScreen(),
      ),
    );
  }
}
