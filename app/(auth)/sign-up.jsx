import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import logo from "../../assets/logo.png";

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSignUp = async () => {
    const { username, email, password, confirmPassword } = form;

    if (!username || !email || !password || !confirmPassword) {
      return Alert.alert("Validation Error", "Please fill in all fields.");
    }

    // Username must contain both letters and numbers
    if (/^\d+$/.test(username) || /^[A-Za-z]+$/.test(username)) {
      return Alert.alert("Username Error", "Username must contain both letters and numbers.");
    }

    if (password !== confirmPassword) {
      return Alert.alert("Password Mismatch", "Passwords do not match.");
    }

    if (password.length < 6) {
      return Alert.alert("Password Error", "Password must be at least 6 characters long.");
    }

    setIsLoading(true);

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      Alert.alert("Success", "Account created successfully!");
      router.push("/sign-in");
    } catch (error) {
      let errorMessage = "An error occurred during registration.";
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "This email is already registered. Please use a different email or sign in.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak. Please choose a stronger password.";
          break;
        default:
          errorMessage = error.message;
      }
      
      Alert.alert("Registration Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={logo} style={styles.logo} />

        <Text style={styles.title}>Welcome to AchieveIt</Text>
        <Text style={styles.subtitle}>SIGN UP</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Username:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="#7B7B8B"
            value={form.username}
            onChangeText={(text) => handleChange("username", text)}
          />

          <Text style={styles.label}>Email address:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#7B7B8B"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
          />

          <Text style={styles.label}>Password:</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor="#7B7B8B"
              secureTextEntry={!showPassword}
              value={form.password}
              onChangeText={(text) => handleChange("password", text)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={!showPassword ? icons.eye : icons.eyeHide}
                style={styles.eyeIcon}
                tintColor="#445E8C"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm Password:</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm your password"
              placeholderTextColor="#7B7B8B"
              secureTextEntry={!showPassword}
              value={form.confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={!showPassword ? icons.eye : icons.eyeHide}
                style={styles.eyeIcon}
                tintColor="#445E8C"
              />
            </TouchableOpacity>
          </View>
        </View>

        <CustomButton title="Sign Up" handlePress={handleSignUp} isLoading={isLoading} />

        <TouchableOpacity onPress={() => router.push("/sign-in")}>
          <Text style={styles.signInText}>
            Already have an account?{" "}
            <Text style={styles.signInLink}>Sign In</Text>
          </Text>
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
    boxShadow: "0px 5px 8px rgba(68, 94, 140, 0.2)",
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
