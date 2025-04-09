import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; // Import useRouter
import { icons } from "../../constants"; 
import CustomButton from "../../components/CustomButton"; 
import logo from "../../assets/logo.png";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const router = useRouter(); // Initialize router

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={logo} style={styles.logo} />

        <Text style={styles.title}>Welcome to AchieveIt</Text>
        <Text style={styles.subtitle}>SIGN UP</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Username :</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="#7B7B8B"
            value={form.username}
            onChangeText={(text) => setForm({ ...form, username: text })}
          />

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
          <Text style={styles.label}>Confirm Password :</Text>
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

        <CustomButton title="Sign Up" handlePress={() => router.push("/sign-in")} />
        <Text style={styles.orText}>─── Or login with ───</Text>
        <View style={styles.socialIcons}>
          <TouchableOpacity>
            <Image source={require("../../assets/fb.png")} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require("../../assets/google.png")} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require("../../assets/ios.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>

        {/* Navigation to Sign In */}
        <TouchableOpacity onPress={() => router.push("/sign-in")}>
          <Text style={styles.signInText}>Already have an account? <Text style={styles.signInLink}>Sign In</Text></Text>
        </TouchableOpacity>
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
    width: "90%",
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
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#445E8C",
  },
  subtitle: {
    fontSize: 20,
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
    height: 45,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#D3D3D3",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 45,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#D3D3D3",
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: "#445E8C",
  },
  orText: {
    marginTop: 10,
    color: "#445E8C",
    fontSize: 14,
  },
  socialIcons: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  signInText: {
    marginTop: 15,
    fontSize: 14,
    color: "#445E8C",
  },
  signInLink: {
    fontWeight: "bold",
    color: "#445E8C",
    textDecorationLine: "underline",
  },
});

export default SignUp;
