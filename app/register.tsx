import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { register } from "../services/authService";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState<string | null>(null);

  const isDev = typeof __DEV__ !== 'undefined' && __DEV__;

  const validatePassword = (pass: string) => {
    if (isDev) {
      // Relaxed rules for testing: minimum 6 chars, at least one letter and one number
      const minLength = pass.length >= 6;
      const hasLetter = /[A-Za-z]/.test(pass);
      const hasNumber = /[0-9]/.test(pass);
      return minLength && hasLetter && hasNumber;
    }

    // Production rules: stricter
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>/\']/.test(pass);
    return minLength && hasUpper && hasLower && hasSpecial;
  };

  const isEmailValid = email.length === 0 || /\S+@\S+\.\S+/.test(email);

  const passwordHelp = isDev
    ? "Şifre en az 6 karakter olmalı ve en az bir harf ile bir rakam içermelidir."
    : "Şifre en az 8 karakter olmalı, 1 büyük harf, 1 küçük harf ve en az 1 özel karakter içermelidir.";

  useEffect(() => {
    return () => {
      // Unmount sırasında (veya route değişimlerinde) odak hala bir inputta kalırsa, web'de blur yaparak
      // aria-hidden uyarısını önlüyoruz.
      if (Platform.OS === 'web') {
        try {
          const active = document.activeElement as HTMLElement | null;
          if (active && typeof active.blur === 'function') active.blur();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Also blur when the screen loses focus (navigation away) to avoid aria-hidden focus issues
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

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Eksik Bilgi", "Lütfen tüm alanları doldur.");
      return;
    }

    // Clear previous errors when user takes action
    setRegisterError(null);

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("E-posta Hatası", "Lütfen geçerli bir e-posta adresi giriniz.");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        "Zayıf Şifre",
        passwordHelp
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Şifre Hatası", "Şifreler eşleşmiyor.");
      return;
    }

    try {
      console.log("Starting registration for:", email);
      await register(email, password, name);
      console.log("Registration successful");

      // Web ortamında yönlendirmeden önce odaklı elementi blur et (aria-hidden uyarısını önlemek için)
      if (Platform.OS === 'web') {
        try {
          const active = document.activeElement as HTMLElement | null;
          if (active && typeof active.blur === 'function') active.blur();
        } catch (e) {
          // ignore
        }
      }

      Alert.alert(
        "Başarılı 🎉",
        "Başarıyla kaydoldunuz! Giriş sayfasına yönlendiriliyorsunuz.",
        [
          {
            text: "Tamam",
            onPress: () => router.push("/"),
          },
        ]
      );
    } catch (error: any) {
      console.log("Register screen catch block:", error);
      const friendly = error.message || 'Kayıt oluşturulamadı.';
      setRegisterError(friendly);
      if (typeof (error as any).serverMessage === 'string' && isDev) {
        // show raw server message in dev for debugging
        setRegisterError(`${friendly} (${(error as any).serverMessage})`);
      }
      Alert.alert("Hata", friendly);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient colors={["#89F7FE", "#66A6FF"]} style={styles.gradient}>
        <View style={styles.overlay}>
          <Text style={styles.title}>Kayıt Ol</Text>
          <Text style={styles.subtitle}>Yeni bir hesap oluştur 💫</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Ad Soyad"
              placeholderTextColor="#004AAD88"
              value={name}
              onChangeText={setName}
            />

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
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Şifre (Tekrar)"
              placeholderTextColor="#004AAD88"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <Text style={styles.helperText}>{passwordHelp}</Text>

            <TouchableOpacity
              style={[styles.button, !isEmailValid && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={!isEmailValid}
            >
              <LinearGradient
                colors={["#66A6FF", "#89F7FE"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Kayıt Ol</Text>
              </LinearGradient>
            </TouchableOpacity>

            {registerError && <Text style={styles.errorText}>{registerError}</Text>}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Zaten hesabın var mı?</Text>
              <TouchableOpacity onPress={() => router.push("/")}>
                <Text style={styles.loginLink}>Giriş Yap</Text>
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
    fontSize: 40,
    color: "#004AAD",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#004AAD",
    marginBottom: 30,
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
  helperText: {
    color: "#004AAD",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
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
  loginLink: {
    color: "#004AAD",
    fontWeight: "bold",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
});
