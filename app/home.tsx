import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const router = useRouter();

  const [dailyWord, setDailyWord] = useState({
    word: "Persistence",
    meaning: "Azim, kararlılık",
    example: "Success requires persistence.",
  });

  // 🔹 Sadece aktif OLMAYAN bölümler için
  const handlePress = (section: string) => {
    Alert.alert("Yakında!", `${section} bölümü henüz aktif değil.`);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d",
        }}
        style={styles.bgImage}
        blurRadius={5}
      >
        <LinearGradient colors={["#89F7FE", "#66A6FF"]} style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.scroll}>
            {/* Üst kısım */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Hoş geldin 👋</Text>
                <Text style={styles.username}>Kullanıcı</Text>
              </View>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                }}
                style={styles.profileImage}
              />
            </View>

            {/* Kartlar */}
            <View style={styles.cardContainer}>
              {/* Dersler */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push("/lessons")}
              >
                <Ionicons name="book-outline" size={42} color="#004AAD" />
                <Text style={styles.cardText}>Dersler</Text>
                <Text style={styles.desc}>A1 - C2 seviye içerikler</Text>
              </TouchableOpacity>

              {/* Quizler */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => handlePress("Quizler")}
              >
                <Ionicons name="bulb-outline" size={42} color="#004AAD" />
                <Text style={styles.cardText}>Quizler</Text>
                <Text style={styles.desc}>Bilgini test et</Text>
              </TouchableOpacity>

              {/* Kelime Kartları */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => handlePress("Kelime Kartları")}
              >
                <Ionicons
                  name="chatbubbles-outline"
                  size={42}
                  color="#004AAD"
                />
                <Text style={styles.cardText}>Kelime Kartları</Text>
                <Text style={styles.desc}>Ezberle & Tekrar Et</Text>
              </TouchableOpacity>

              {/* 🎮 OYUN ALANI – ASIL DÜZELEN YER */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push("/games")}
              >
                <Ionicons
                  name="game-controller-outline"
                  size={42}
                  color="#004AAD"
                />
                <Text style={styles.cardText}>Oyun Alanı</Text>
                <Text style={styles.desc}>Eğlenerek öğren</Text>
              </TouchableOpacity>

              {/* Dil Pratiği */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push("/aiChat")}
              >
                <Ionicons name="mic-outline" size={42} color="#004AAD" />
                <Text style={styles.cardText}>Dil Pratiği</Text>
                <Text style={styles.desc}>Konuşarak öğren</Text>
              </TouchableOpacity>
            </View>

            {/* Günün Kelimesi */}
            <View style={styles.wordBox}>
              <Text style={styles.wordTitle}>Günün Kelimesi 🌟</Text>
              <Text style={styles.word}>{dailyWord.word}</Text>
              <Text style={styles.wordMeaning}>
                n. {dailyWord.meaning}
              </Text>
              <Text style={styles.wordExample}>
                Example: “{dailyWord.example}”
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgImage: { flex: 1, resizeMode: "cover" },
  overlay: { flex: 1 },
  scroll: { padding: 20, alignItems: "center" },

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  greeting: { color: "#004AAD", fontSize: 18 },
  username: { color: "#004AAD", fontSize: 24, fontWeight: "bold" },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#004AAD",
  },

  cardContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  card: {
    width: "44%",
    height: 150,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 3 },
  },
  cardText: {
    color: "#004AAD",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  desc: {
    color: "#004AAD",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },

  wordBox: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 15,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  wordTitle: {
    color: "#004AAD",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  word: {
    color: "#004AAD",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  wordMeaning: { color: "#004AAD", fontSize: 16 },
  wordExample: {
    color: "#004AAD",
    fontSize: 14,
    marginTop: 4,
    fontStyle: "italic",
  },
});
