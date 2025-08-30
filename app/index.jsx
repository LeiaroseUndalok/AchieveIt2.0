import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';

export default function App() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [buttonAnim] = useState(new Animated.Value(1));

  // Fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, []);

  // Button animation
  const handlePressIn = () => {
    Animated.spring(buttonAnim, {
      toValue: 0.95,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <AntDesign name="checkcircle" size={36} color="#6A88BE" style={styles.icon} />
        <Text style={styles.title}>AchieveIt</Text>
      </View>
<Text style={styles.subtitle}>Stay organized and enhance productivity with AchieveIt</Text>
      {/* Removed animated message */}

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
        <Text style={styles.footerText}>by CCTC-CCS</Text>
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
    marginBottom: 5,
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
  button: {
    backgroundColor: '#6A88BE',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    boxShadow: '0px 4px 6px rgba(96, 111, 73, 0.4)',
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
  subtitle: {
  color: '#6A88BE',
  fontSize: 16,
  textAlign: 'center',
  marginTop: 0,
  marginBottom: 10,
  paddingHorizontal: 10,
  lineHeight: 22,
},

});
