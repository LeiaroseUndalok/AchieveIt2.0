import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';

export default function App() {
  const [fadeAnim] = useState(new Animated.Value(0)); // Fade-in animation
  const [buttonAnim] = useState(new Animated.Value(1)); // Button press animation
  const [text, setText] = useState(''); // Typewriter text
  const [cursorVisible, setCursorVisible] = useState(true); // Cursor blinking
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
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Button animation
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
      {/* Title */}
      <View style={styles.titleContainer}>
        <AntDesign name="checkcircle" size={36} color="#6A88BE" style={styles.icon} />
        <Text style={styles.title}>AchieveIt</Text>
      </View>

      {/* Message with typewriter effect */}
      <Text style={styles.messageText}>
        {text}
        <Text style={styles.cursor}>{cursorVisible ? '|' : ' '}</Text>
      </Text>

      {/* Button */}
      <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Link href="/sign-in" style={styles.buttonText}>Get Started</Link>
        </TouchableOpacity>
      </Animated.View>

      {/* Footer */}
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
    backgroundColor: '#C9D9F0',
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
    color: '#6A88BE',
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  messageText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#445E8C',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  cursor: {
    color: '#445E8C',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 2,
  },
  button: {
    backgroundColor: '#6A88BE',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#606F49',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: '#FFF',
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
    color: '#6A88BE',
    fontSize: 14,
  },
});
