import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 30; // responsive kart genişliği

export default function Games() {
  const router = useRouter();

  // 🔹 Tüm ikonlar Ionicons setinde ve gözükür
  const gamesList = [
    { title: "Emoji Hafıza", route: "/emoji-hafiza", icon: "happy-outline", color: "#FF6B6B" },
    { title: "Adam Asmaca", route: "/adam-asmaca", icon: "person-outline", color: "#4ECDC4" },
    { title: "Bulmaca", route: "/bulmaca", icon: "grid-outline", color: "#FFD93D" },
    { title: "Kelime Anlam", route: "/kelime-anlam", icon: "book-outline", color: "#1A535C" },
    { title: "Kelime Yakala", route: "/kelime-yakala", icon: "rocket-outline", color: "#FF6B6B" },
  ];

  return (
    <LinearGradient colors={["#89F7FE", "#66A6FF"]} style={styles.container}>
      <Text style={styles.title}>Oyun Alanı 🎮</Text>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {gamesList.map((game, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { borderColor: game.color, width: CARD_WIDTH }]}
            onPress={() => router.push(game.route)}
            activeOpacity={0.8}
          >
            <Ionicons name={game.icon as any} size={42} color={game.color} />
            <Text style={styles.cardText}>{game.title}</Text>
            <Text style={styles.desc}>Eğlenerek öğren</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#004AAD",
    marginBottom: 20,
  },
  scrollContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingBottom: 40, // alt kart görünmesi için
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.4)", // ana sayfa ile aynı
    borderRadius: 18,
    marginVertical: 10,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
    color: "#004AAD",
    textAlign: "center",
  },
  desc: {
    fontSize: 13,
    color: "#004AAD",
    marginTop: 4,
    textAlign: "center",
  },
});
