import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import logo from "../../assets/logo.png";

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Logo */}
        <Image source={logo} style={styles.logo} />

        {/* Title */}
        <Text style={styles.title}>Welcome Back to AchieveIt</Text>
        <Text style={styles.subtitle}>LOGIN</Text>

        {/* Input Fields */}
        <View style={styles.form}>
          <Text style={styles.label}>Email address :</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#7B7B8B"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />

          <Text style={styles.label}>Password :</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor="#7B7B8B"
              secureTextEntry={!showPassword}
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image source={!showPassword ? icons.eye : icons.eyeHide} style={styles.eyeIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <CustomButton title="Login" handlePress={() => router.push("/task")} />

        {/* Sign Up Redirect */}
        <View style={styles.signUpRedirect}>
          <Text style={{ color: "#445E8C" }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/sign-up")}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6A88BE",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#B1CDF6",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#445E8C",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#445E8C",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#445E8C",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    color: "#445E8C",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#D3D3D3",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#D3D3D3",
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: "#445E8C",
  },
  forgotPassword: {
    fontSize: 14,
    color: "#445E8C",
    textDecorationLine: "underline",
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  signUpRedirect: {
    flexDirection: "row",
    marginTop: 15,
  },
  signUpText: {
    color: "#445E8C",
    fontWeight: "bold",
  },
});

export default SignIn;
