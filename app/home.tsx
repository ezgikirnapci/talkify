import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { useAuth } from "../contexts/AuthContext";
import { getDailyWord } from "../services/flashcardService";
import { getStreak, logActivity } from "../services/gamificationService";

export default function Home() {
  const router = useRouter();
  const { user, token, logout } = useAuth();

  const [dailyWord, setDailyWord] = useState({
    word: "Persistence",
    meaning: "Azim, kararlılık",
    example: "Success requires persistence.",
  });
  const [streakCount, setStreakCount] = useState(0);

  // Fetch daily word and streak on mount
  useEffect(() => {
    const fetchData = async () => {
      // Log activity and update streak
      if (token) {
        try {
          const streakResult = await logActivity(token);
          setStreakCount(streakResult.streak_count);
        } catch (error) {
          console.log("Streak update failed:", error);
          try {
            const streakInfo = await getStreak(token);
            setStreakCount(streakInfo.streak_count);
          } catch (e) {
            // Backend may be offline
          }
        }
      }

      // Fetch daily word
      try {
        const result = await getDailyWord(token);
        if (result?.word) {
          setDailyWord({
            word: result.word.word,
            meaning: result.word.meaning,
            example: result.word.example_sentence || "Example not available.",
          });
        }
      } catch (error) {
        console.log("Daily word fetch failed, using default:", error);
      }
    };

    fetchData();
  }, [token]);

  const displayName = user?.username || user?.email?.split('@')[0] || "Kullanıcı";

  // Sadece aktif OLMAYAN bölümler için
  const handlePress = (section: string) => {
    Alert.alert("Yakında!", `${section} bölümü henüz aktif değil.`);
  };

  // Çıkış butonu
  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabından çıkmak istediğinden emin misin?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/");
          },
        },
      ]
    );
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
                <Text style={styles.username}>{displayName}</Text>
                {streakCount > 0 && (
                  <Text style={styles.streak}>🔥 {streakCount} gün seri!</Text>
                )}
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                  <Ionicons name="log-out-outline" size={24} color="#004AAD" />
                </TouchableOpacity>
                <Image
                  source={{
                    uri: user?.avatar_url || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                  }}
                  style={styles.profileImage}
                />
              </View>
            </View>

            {/* Kartlar */}
            <View style={styles.cardContainer}>
              {/* Dersler */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push("./lessons")}
              >
                <Ionicons name="book-outline" size={42} color="#004AAD" />
                <Text style={styles.cardText}>Dersler</Text>
                <Text style={styles.desc}>A1 - C2 seviye içerikler</Text>
              </TouchableOpacity>

              {/* Quizler */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push("./quiz")}
              >
                <Ionicons name="bulb-outline" size={42} color="#004AAD" />
                <Text style={styles.cardText}>Quizler</Text>
                <Text style={styles.desc}>Bilgini test et</Text>
              </TouchableOpacity>

              {/* Kelime Kartları */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push("./flashcards")}
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
                onPress={() => router.push("./games")}
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
                onPress={() => router.push("./aiChat")}
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
  streak: {
    color: "#FF6B35",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutBtn: {
    padding: 8,
    marginRight: 10,
  },
});
