import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Reanimated, {
  FadeIn,
  FlipInYRight,
  FlipOutYLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";
import { flashcards } from "./data/flashcardData";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width - 80;

export default function Flashcards() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<number[]>([]);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotateZ = useSharedValue(0);

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const flipCard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
      translateX.value = 0;
      translateY.value = 0;
      scale.value = 1;
      rotateZ.value = 0;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
      translateX.value = 0;
      translateY.value = 0;
      scale.value = 1;
      rotateZ.value = 0;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const markAsKnown = () => {
    if (!knownCards.includes(currentCard.id)) {
      setKnownCards([...knownCards, currentCard.id]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    nextCard();
  };

  const resetProgress = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards([]);
    translateX.value = 0;
    translateY.value = 0;
    scale.value = 1;
    rotateZ.value = 0;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      scale.value = withSpring(0.95);
    },
    onPanResponderMove: (evt, gestureState) => {
      translateX.value = gestureState.dx;
      translateY.value = gestureState.dy;
      rotateZ.value = gestureState.dx * 0.1;
    },
    onPanResponderRelease: (evt, gestureState) => {
      const swipeThreshold = 100;

      if (Math.abs(gestureState.dx) > swipeThreshold) {
        if (gestureState.dx > 0) {
          // Swipe right - previous card
          prevCard();
        } else {
          // Swipe left - next card
          nextCard();
        }
      } else {
        // Return to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotateZ.value = withSpring(0);
        scale.value = withSpring(1);
      }
    },
  });

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateZ: `${rotateZ.value}deg` },
      ],
    };
  });

  const flipRotation = useSharedValue(0);

  useEffect(() => {
    flipRotation.value = withSpring(isFlipped ? 180 : 0, {
      damping: 15,
      stiffness: 100,
    });
  }, [isFlipped]);

  const cardFrontStyle = useAnimatedStyle(() => {
    const rotation = flipRotation.value;
    return {
      transform: [
        { rotateY: `${rotation}deg` },
        { scale: rotation > 90 ? 0.95 : 1 },
      ],
      opacity: rotation < 90 ? 1 : 0,
    };
  });

  const cardBackStyle = useAnimatedStyle(() => {
    const rotation = flipRotation.value;
    return {
      transform: [
        { rotateY: `${rotation - 180}deg` },
        { scale: rotation > 90 ? 1 : 0.95 },
      ],
      opacity: rotation > 90 ? 1 : 0,
    };
  });

  if (currentIndex >= flashcards.length) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={["#89F7FE", "#66A6FF"]} style={styles.gradient}>
          <View style={styles.completedContainer}>
            <Reanimated.View
              entering={FadeIn.duration(500)}
              style={styles.completedCard}
            >
              <Ionicons name="trophy" size={64} color="#FFD700" />
              <Text style={styles.completedTitle}>Tebrikler! 🎉</Text>
              <Text style={styles.completedText}>
                Tüm kelime kartlarını tamamladın!
              </Text>
              <Text style={styles.completedStats}>
                Öğrenilen: {knownCards.length} / {flashcards.length}
              </Text>
              <View style={styles.completedButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={resetProgress}
                >
                  <Text style={styles.buttonText}>Tekrar Başla</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => router.back()}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                    Ana Sayfa
                  </Text>
                </TouchableOpacity>
              </View>
            </Reanimated.View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#89F7FE", "#66A6FF"]} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#004AAD" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kelime Kartları</Text>
          <View style={styles.progressBadge}>
            <Text style={styles.progressBadgeText}>
              {currentIndex + 1}/{flashcards.length}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.knownCardsText}>
            Öğrenilen: {knownCards.length} kelime
          </Text>
        </View>

        {/* Card Container */}
        <View style={styles.cardContainer}>
          <Reanimated.View
            style={[styles.cardWrapper, animatedCardStyle]}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={flipCard}
              style={styles.cardTouchable}
            >
              <Reanimated.View
                style={[styles.card, styles.cardFront, cardFrontStyle]}
                entering={FlipInYRight}
                exiting={FlipOutYLeft}
              >
                <View style={styles.cardCategory}>
                  <Text style={styles.categoryText}>
                    {currentCard.category}
                  </Text>
                </View>
                <Text style={styles.cardFrontText}>{currentCard.front}</Text>
                <View style={styles.flipHint}>
                  <Ionicons name="sync" size={20} color="#004AAD" />
                  <Text style={styles.flipHintText}>Dokunarak çevir</Text>
                </View>
              </Reanimated.View>
              <Reanimated.View
                style={[styles.card, styles.cardBack, cardBackStyle]}
              >
                <Text style={styles.cardBackText}>{currentCard.back}</Text>
                {currentCard.example && (
                  <View style={styles.exampleContainer}>
                    <Text style={styles.exampleLabel}>Örnek:</Text>
                    <Text style={styles.exampleText}>
                      {currentCard.example}
                    </Text>
                  </View>
                )}
                <View style={styles.flipHint}>
                  <Ionicons name="sync" size={20} color="#fff" />
                  <Text style={[styles.flipHintText, { color: "#fff" }]}>
                    Tekrar dokunarak çevir
                  </Text>
                </View>
              </Reanimated.View>
            </TouchableOpacity>
          </Reanimated.View>

          {/* Known Badge */}
          {knownCards.includes(currentCard.id) && (
            <View style={styles.knownBadge}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={styles.knownBadgeText}>Öğrenildi</Text>
            </View>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, currentIndex === 0 && styles.disabledButton]}
            onPress={prevCard}
            disabled={currentIndex === 0}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={currentIndex === 0 ? "#ccc" : "#004AAD"}
            />
            <Text
              style={[
                styles.controlButtonText,
                currentIndex === 0 && styles.disabledButtonText,
              ]}
            >
              Önceki
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.knownButton]}
            onPress={markAsKnown}
          >
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={[styles.controlButtonText, { color: "#4CAF50" }]}>
              Öğrendim
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              currentIndex === flashcards.length - 1 && styles.disabledButton,
            ]}
            onPress={nextCard}
            disabled={currentIndex === flashcards.length - 1}
          >
            <Text
              style={[
                styles.controlButtonText,
                currentIndex === flashcards.length - 1 && styles.disabledButtonText,
              ]}
            >
              Sonraki
            </Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={
                currentIndex === flashcards.length - 1 ? "#ccc" : "#004AAD"
              }
            />
          </TouchableOpacity>
        </View>

        {/* Swipe Hint */}
        <Text style={styles.swipeHint}>
          👈 👉 Kaydırarak kartları değiştirebilirsin
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#004AAD",
  },
  progressBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  progressBadgeText: {
    color: "#004AAD",
    fontWeight: "600",
    fontSize: 14,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  knownCardsText: {
    color: "#004AAD",
    fontSize: 12,
    textAlign: "right",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.4,
  },
  cardTouchable: {
    width: "100%",
    height: "100%",
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    position: "absolute",
    backfaceVisibility: "hidden",
  },
  cardFront: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 24,
    padding: 32,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
    borderWidth: 2,
    borderColor: "rgba(0,74,173,0.1)",
  },
  cardBack: {
    width: "100%",
    height: "100%",
    backgroundColor: "#004AAD",
    borderRadius: 24,
    padding: 32,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  cardCategory: {
    backgroundColor: "rgba(0,74,173,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: "#004AAD",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  cardFrontText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#004AAD",
    textAlign: "center",
  },
  cardBackText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  exampleContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 16,
    borderRadius: 12,
    width: "100%",
  },
  exampleLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.9,
  },
  exampleText: {
    color: "#fff",
    fontSize: 16,
    fontStyle: "italic",
    lineHeight: 24,
  },
  flipHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flipHintText: {
    color: "#004AAD",
    fontSize: 12,
    opacity: 0.7,
  },
  knownBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76,175,80,0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  knownBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  knownButton: {
    backgroundColor: "rgba(76,175,80,0.1)",
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  disabledButton: {
    opacity: 0.5,
  },
  controlButtonText: {
    color: "#004AAD",
    fontSize: 14,
    fontWeight: "600",
  },
  disabledButtonText: {
    color: "#ccc",
  },
  swipeHint: {
    color: "#004AAD",
    fontSize: 12,
    textAlign: "center",
    paddingBottom: 20,
    opacity: 0.7,
  },
  completedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  completedCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#004AAD",
    marginTop: 20,
    marginBottom: 12,
  },
  completedText: {
    fontSize: 16,
    color: "#004AAD",
    textAlign: "center",
    marginBottom: 20,
  },
  completedStats: {
    fontSize: 20,
    fontWeight: "600",
    color: "#66A6FF",
    marginBottom: 30,
  },
  completedButtons: {
    width: "100%",
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#004AAD",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#004AAD",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#004AAD",
  },
});

