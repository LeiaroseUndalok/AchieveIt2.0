import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import logo from "../../assets/logo.png";

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSignIn = async () => {
    const { email, password } = form;

    if (!email || !password) {
      return Alert.alert("Validation Error", "Please fill in all fields.");
    }

    setIsLoading(true);

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      Alert.alert("Success", "Welcome back!");
      router.push("/task");
    } catch (error) {
      let errorMessage = "An error occurred during sign in.";
      let alertTitle = "Sign In Error";
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "This email is not registered. Please sign up first.";
          alertTitle = "Email Not Registered";
          break;
        case 'auth/wrong-password':
          errorMessage = "The password you entered is incorrect. Please try again.";
          alertTitle = "Wrong Credentials";
          break;
        case 'auth/invalid-email':
          errorMessage = "The email address is invalid. Please enter a valid email address.";
          alertTitle = "Invalid Email";
          break;
        case 'auth/user-disabled':
          errorMessage = "This account has been disabled.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        default:
          errorMessage = error.message;
      }
      
      Alert.alert(alertTitle, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
              <Image source={!showPassword ? icons.eye : icons.eyeHide} style={styles.eyeIcon} tintColor="#445E8C" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <CustomButton title="Login" handlePress={handleSignIn} isLoading={isLoading} />

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
    boxShadow: "0px 5px 8px rgba(68, 94, 140, 0.2)",
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
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
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
