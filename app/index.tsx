import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { login } from "../services/authService";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen e-posta ve şifre giriniz!");
      return;
    }

    // Allow any valid-looking email for testing (e.g. user@example.com)
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("E-posta Hatası", "Lütfen geçerli bir e-posta adresi giriniz.");
      return;
    }

    try {
      console.log("Starting login process for:", email);
      await login(email, password);
      console.log("Login successful, navigating to home");

      // Blur focused element before navigation on web to avoid aria-hidden warnings
      if (Platform.OS === 'web') {
        try {
          const active = document.activeElement as HTMLElement | null;
          if (active && typeof active.blur === 'function') active.blur();
        } catch (e) {
          // ignore
        }
      }

      router.push("/home");
    } catch (error: any) {
      console.log("Login screen catch block:", error);
      // Show only user-friendly message under the button (do not expose raw error codes to end-users)
      setLoginError(error.message || "E-posta veya şifre hatalıdır.");
    }
  };

  const isEmailValid = email.length === 0 || /\S+@\S+\.\S+/.test(email);

  // Blur focused element when screen loses focus to prevent aria-hidden focus issues on web
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (Platform.OS === 'web') {
          try {
            const active = document.activeElement as HTMLElement | null;
            if (active && typeof active.blur === 'function') active.blur();
          } catch (e) {
            // ignore
          }
        }
      };
    }, [])
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient colors={["#89F7FE", "#66A6FF"]} style={styles.gradient}>
        <View style={styles.overlay}>
          <Text style={styles.title}>Talkify</Text>

          <View style={styles.form}>
            <TextInput
              style={[styles.input, !isEmailValid && styles.inputError]}
              placeholder="E-posta"
              placeholderTextColor="#004AAD88"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {!isEmailValid && (
              <Text style={styles.errorText}>Lütfen geçerli bir e-posta adresi giriniz.</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Şifre"
              placeholderTextColor="#004AAD88"
              secureTextEntry
              value={password}
              onChangeText={(text) => { setPassword(text); setLoginError(null); }}
            />

            <TouchableOpacity
              style={[styles.button, !isEmailValid && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={!isEmailValid}
            >
              <LinearGradient
                colors={["#66A6FF", "#89F7FE"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Giriş Yap</Text>
              </LinearGradient>
            </TouchableOpacity>

            {loginError && <Text style={styles.errorText}>{loginError}</Text>}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Hesabın yok mu?</Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.registerLink}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 48,
    color: "#004AAD",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#004AAD",
    marginBottom: 40,
  },
  form: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    height: 50,
    borderColor: "rgba(0,0,0,0.1)",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    color: "#004AAD",
  },
  inputError: {
    borderColor: "#ff4d4d",
    borderWidth: 2,
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
    fontWeight: "600",
  },
  button: { marginTop: 10 },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  footerText: { color: "#004AAD" },
  registerLink: {
    color: "#004AAD",
    fontWeight: "bold",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
});
