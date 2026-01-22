import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';

void main() {
  runApp(const ClassyCrafthApp());
}

class ClassyCrafthApp extends StatelessWidget {
  const ClassyCrafthApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ClassyCrafth',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xffE46B2D),
        scaffoldBackgroundColor: const Color(0xffF9FAFB),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xffE46B2D),
          foregroundColor: Colors.white,
          centerTitle: true,
          elevation: 1,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xffE46B2D),
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
            ),
            padding: const EdgeInsets.symmetric(vertical: 14),
            textStyle:
                const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
          ),
        ),
      ),
      home: const SplashScreen(),
    );
  }
}
