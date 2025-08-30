import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, Animated } from "react-native";

const CustomButton = ({ title, handlePress, isLoading }) => {
  const buttonScale = new Animated.Value(1);

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: false }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: false }),
    ]).start();
  };

  return (
    <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
      <TouchableOpacity
        onPress={() => {
          animatePress();
          handlePress();
        }}
        activeOpacity={0.8}
        style={[styles.button, isLoading && styles.disabledButton]}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "90%",
    minHeight: 60,
    backgroundColor: "#6A88BE",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 5px 10px rgba(106, 136, 190, 0.4)",
    elevation: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default CustomButton;
