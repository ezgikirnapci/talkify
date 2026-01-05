import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Reanimated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { quizQuestions } from "./data/quizData";

export default function Quiz() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    // Haptic feedback
    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScore(score + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto advance after 2 seconds
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowFeedback(false);
    setShowResult(false);
  };

  const feedbackRef = useRef<any>(null);

  useEffect(() => {
    if (showFeedback && Platform.OS === 'web') {
      try {
        const active = (document && document.activeElement) as HTMLElement | null;
        if (active && typeof (active as any).blur === 'function') (active as any).blur();
        const el = feedbackRef.current as any;
        if (el && typeof el.focus === 'function') el.focus();
      } catch (e) {
        // ignore in non-browser envs
      }
    }
  }, [showFeedback]);
  const getOptionStyle = (index: number) => {
    if (selectedAnswer === null) {
      return styles.option;
    }

    if (index === currentQuestion.correctAnswer) {
      return [styles.option, styles.correctOption];
    }

    if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
      return [styles.option, styles.incorrectOption];
    }

    return [styles.option, styles.disabledOption];
  };

  if (showResult) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={["#89F7FE", "#66A6FF"]} style={styles.gradient}>
          <View style={styles.resultContainer}>
            <Reanimated.View
              entering={FadeIn.duration(500)}
              style={styles.resultCard}
            >
              <Text style={styles.resultTitle}>Quiz Tamamlandı! 🎉</Text>
              <Text style={styles.resultScore}>
                {score} / {quizQuestions.length}
              </Text>
              <Text style={styles.resultPercentage}>
                {Math.round((score / quizQuestions.length) * 100)}%
              </Text>
              <Text style={styles.resultMessage}>
                {score === quizQuestions.length
                  ? "Mükemmel! Tüm soruları doğru cevapladın! 🌟"
                  : score >= quizQuestions.length / 2
                    ? "İyi iş! Biraz daha pratik yapmalısın. 💪"
                    : "Tekrar denemekten çekinme! Devam et! 🚀"}
              </Text>

              <View style={styles.resultButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={resetQuiz}
                >
                  <Text style={styles.buttonText}>Tekrar Dene</Text>
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
          <Text style={styles.headerTitle}>Quiz</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Skor: {score}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
                { transform: [{ scale: scaleAnim }] },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} / {quizQuestions.length}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Question Card */}
          <Reanimated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            style={styles.questionCard}
          >
            <Text style={styles.questionNumber}>
              Soru {currentQuestionIndex + 1}
            </Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </Reanimated.View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <Reanimated.View
                key={index}
                entering={FadeIn.delay(index * 100).duration(300)}
              >
                <TouchableOpacity
                  style={getOptionStyle(index)}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                >
                  <Text style={styles.optionText}>{option}</Text>
                  {selectedAnswer !== null &&
                    index === currentQuestion.correctAnswer && (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    )}
                  {selectedAnswer === index &&
                    index !== currentQuestion.correctAnswer && (
                      <Ionicons name="close-circle" size={24} color="#F44336" />
                    )}
                </TouchableOpacity>
              </Reanimated.View>
            ))}
          </View>

          {/* Feedback Modal */}
          {showFeedback && (
            <Reanimated.View
              entering={SlideInDown.duration(300)}
              exiting={SlideOutDown.duration(200)}
              style={styles.feedbackContainer}
            >
              <View
                ref={feedbackRef as any}
                style={[
                  styles.feedbackCard,
                  isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect,
                ]}
                accessible
                accessibilityRole="alert"
                {...(Platform.OS === 'web' ? { tabIndex: -1 } : {})}
              >
                <Ionicons
                  name={isCorrect ? "checkmark-circle" : "close-circle"}
                  size={48}
                  color={isCorrect ? "#4CAF50" : "#F44336"}
                />
                <Text style={styles.feedbackText}>
                  {isCorrect ? "Doğru! 🎉" : "Yanlış! 😔"}
                </Text>
                {currentQuestion.explanation && (
                  <Text style={styles.feedbackExplanation}>
                    {currentQuestion.explanation}
                  </Text>
                )}
              </View>
            </Reanimated.View>
          )}
        </ScrollView>
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
  scoreContainer: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreText: {
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
  progressText: {
    color: "#004AAD",
    fontSize: 12,
    textAlign: "right",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  questionCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  questionNumber: {
    color: "#004AAD",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  questionText: {
    color: "#004AAD",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  correctOption: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
  },
  incorrectOption: {
    backgroundColor: "#FFEBEE",
    borderColor: "#F44336",
  },
  disabledOption: {
    opacity: 0.6,
  },
  optionText: {
    color: "#004AAD",
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  feedbackContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  feedbackCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  feedbackCorrect: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  feedbackIncorrect: {
    borderWidth: 2,
    borderColor: "#F44336",
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
    color: "#004AAD",
  },
  feedbackExplanation: {
    fontSize: 14,
    color: "#004AAD",
    marginTop: 8,
    textAlign: "center",
    opacity: 0.8,
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resultCard: {
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
  resultTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#004AAD",
    marginBottom: 20,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#004AAD",
    marginBottom: 8,
  },
  resultPercentage: {
    fontSize: 32,
    fontWeight: "600",
    color: "#66A6FF",
    marginBottom: 20,
  },
  resultMessage: {
    fontSize: 16,
    color: "#004AAD",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  resultButtons: {
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

