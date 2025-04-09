import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing } from 'react-native';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons'; // For checkmark icon

export default function App() {
  const [fadeAnim] = useState(new Animated.Value(0)); // For fade-in animation
  const [buttonAnim] = useState(new Animated.Value(1)); // For button press animation
  const [text, setText] = useState(''); // For typewriter effect
  const message = "Stay organized and enhance productivity with AchieveIt task manager.";

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < message.length) {
        setText((prev) => prev + message.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 0);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500, // Duration for fade-in
      useNativeDriver: true,
    }).start();
  }, []);

  // Button press animation
  const handlePressIn = () => {
    Animated.spring(buttonAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Animated Checkmark with Title */}
      <View style={styles.titleContainer}>
        <AntDesign name="checkcircle" size={36} color="#6A88BE" style={styles.icon} />
        <Text style={styles.title}>AchieveIt</Text>
      </View>

      {/* Typewriter Effect for SubText */}
      <View style={styles.textContainer}>
        <Text style={[styles.text, styles.extraLightText]}>
          {text}
        </Text>
      </View>

      {/* Animated Button */}
      <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Link href="/sign-in" style={styles.buttonText}>Get Started</Link>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>by CCTC BSIT-A Students</Text>
        <Text style={styles.footerText}>© 2025 AchieveIt. All rights reserved.</Text>
      </View>

      <StatusBar style="light" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C9D9F0', // Light green background for a fresh look
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#6A88BE', // Dark green for title
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginLeft: 10, // Spacing between icon and title
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    marginBottom: 30,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
  extraLightText: {
    fontFamily: 'Poppins-ExtraLight', // Custom Poppins ExtraLight font
    fontSize: 14,
    color: '#6A88BE', // Lighter green for subtle elegance
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#6A88BE', // Darker green button
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30, // Rounded button
    shadowColor: '#606F49', // Dark shadow color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8, // Add depth with shadow
  },
  buttonText: {
    color: '#FFF', // White text for button
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerText: {
    color: '#6A88BE', // Dark green for footer text
    fontSize: 14,
  },
});
