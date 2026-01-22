import 'package:flutter/material.dart';

class AppTheme {
  static const primary = Color(0xffE46B2D);
  static const bg = Color(0xffF6F2EF);

  // ✅ lightTheme so main.dart error fix ho jaayega
  static ThemeData lightTheme = ThemeData(
    scaffoldBackgroundColor: bg,
    primaryColor: primary,

    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      elevation: 0,
      centerTitle: true,
      foregroundColor: Colors.black,
    ),

    // ✅ Flutter 3+ compatible
    cardTheme: const CardThemeData(
      color: Colors.white,
      elevation: 0.8,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(14)),
      ),
    ),

    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
    ),

    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primary,
        foregroundColor: Colors.white, // ✅ button text color fix
        textStyle: const TextStyle(
          fontWeight: FontWeight.bold,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
        ),
      ),
    ),
  );
}
