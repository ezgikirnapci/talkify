import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Bubble, GiftedChat, IMessage } from "react-native-gifted-chat";

// 🔑 Google Gemini API Key - .env dosyasından alınmalı
const GEMINI_API_KEY = "AIzaSyAE_bFI3G-aF90wBLyD_S8WZ14bdHJZrPQ";

// 🔒 LIMITLER
const DAILY_LIMIT = 20;
const MAX_RECORD_SECONDS = 20;
const MAX_TEXT_LENGTH = 200;

export default function AiChat() {
    const router = useRouter();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [recordTime, setRecordTime] = useState(0);
    const [timer, setTimer] = useState<any>(null);

    // Günlük attempt
    const [dailyAttempts, setDailyAttempts] = useState(0);
    const [lastAttemptDate, setLastAttemptDate] = useState<string | null>(null);

    // Menü ve Ayarlar
    const [isPracticeMode, setIsPracticeMode] = useState(false);
    const [showTranslation, setShowTranslation] = useState(true);

    // Günlük reset
    useEffect(() => {
        const today = new Date().toDateString();
        setLastAttemptDate(today);
        setDailyAttempts(0);
    }, []);

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: "Hello! I am your AI English Teacher. (Merhaba! Ben senin yapay zeka İngilizce öğretmeninim.)",
                createdAt: new Date(),
                user: { _id: 2, name: "AI Tutor" },
            },
        ]);
    }, []);

    const formatTime = (sec: number) => `00:${sec.toString().padStart(2, "0")}`;

    // 🎙️ SES KAYIT
    async function startRecording() {
        const today = new Date().toDateString();

        if (lastAttemptDate !== today) {
            setDailyAttempts(0);
            setLastAttemptDate(today);
        }

        if (dailyAttempts >= DAILY_LIMIT) {
            Alert.alert("Limit doldu", "Bugünlük 20 ses deneme hakkını kullandın.");
            return;
        }

        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== "granted") return;

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(recording);
            setRecordTime(0);

            const t = setInterval(() => {
                setRecordTime((prev) => {
                    if (prev + 1 >= MAX_RECORD_SECONDS) {
                        stopRecording();
                        return MAX_RECORD_SECONDS;
                    }
                    return prev + 1;
                });
            }, 1000);

            setTimer(t);
        } catch (e) {
            console.log(e);
        }
    }

    async function stopRecording() {
        if (!recording) return;

        if (timer) clearInterval(timer);
        setTimer(null);

        setIsProcessing(true);
        await recording.stopAndUnloadAsync();

        const uri = recording.getURI();
        setRecording(null);
        setRecordTime(0);

        if (uri) await processVoice(uri);

        setIsProcessing(false);
    }

    async function processVoice(uri: string) {
        try {
            // Sesi Base64 formatına çevir
            const base64Audio = await FileSystem.readAsStringAsync(uri, {
                encoding: 'base64',
            });

            // Gemini 1.5 Flash kullanarak sesi metne çevir
            const sttRes = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    { text: "Transcribe this audio. Only return the transcribed text, nothing else." },
                                    {
                                        inline_data: {
                                            mime_type: "audio/m4a",
                                            data: base64Audio,
                                        },
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            const sttData = await sttRes.json();
            const transcribedText = sttData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

            if (transcribedText) {
                setDailyAttempts((prev) => prev + 1);

                const userMsg: IMessage = {
                    _id: Math.random().toString(),
                    text: transcribedText.slice(0, MAX_TEXT_LENGTH),
                    createdAt: new Date(),
                    user: { _id: 1 },
                };

                setMessages((prev) => GiftedChat.append(prev, [userMsg]));
                await sendToGemini(transcribedText.slice(0, MAX_TEXT_LENGTH));
            }
        } catch (e) {
            console.log("Gemini STT Error:", e);
            Alert.alert("Hata", "Ses işlenirken bir sorun oluştu.");
        }
    }


    // 🤖 Gemini Chat
    async function sendToGemini(text: string) {
        try {
            const translationPrompt = showTranslation
                ? "English + Turkish translation in parentheses."
                : "ONLY English. NO translation.";

            const practicePrompt = isPracticeMode
                ? "Focus on pronunciation feedback."
                : "Casual learning feedback.";

            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.0-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `You are an English pronunciation tutor. Reply in max 200 characters. Use 1–2 short sentences. No paragraphs. ${translationPrompt} ${practicePrompt} User said: ${text.slice(0, MAX_TEXT_LENGTH)}`,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            const data = await res.json();
            console.log("Gemini API Response:", JSON.stringify(data, null, 2));

            // API'den hata gelip gelmediğini kontrol et
            if (data.error) {
                console.log("Gemini API Error:", data.error);
                Alert.alert("API Hatası", data.error.message || "Gemini API'den hata döndü.");
                return;
            }

            let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

            // Eğer yanıt boşsa kullanıcıya bilgi ver
            if (!aiText) {
                console.log("Empty response from Gemini. Full data:", data);
                Alert.alert("Boş Yanıt", "AI'dan yanıt alınamadı. Lütfen tekrar deneyin.");
                return;
            }

            if (aiText.length > MAX_TEXT_LENGTH) {
                aiText = aiText.slice(0, MAX_TEXT_LENGTH - 3) + "...";
            }

            const aiMsg: IMessage = {
                _id: Math.random().toString(),
                text: aiText,
                createdAt: new Date(),
                user: { _id: 2, name: "AI Tutor" },
            };

            setMessages((prev) => GiftedChat.append(prev, [aiMsg]));

            const englishPart = aiText.split("(")[0].trim();
            Speech.speak(englishPart, { language: "en-US" });
        } catch (e) {
            console.log("Gemini Chat Error:", e);
            Alert.alert("Hata", "Yapay zeka yanıt veremedi. İnternet bağlantınızı kontrol edin.");
        }
    }

    const renderBubble = (props: any) => (
        <Bubble
            {...props}
            wrapperStyle={{
                right: { backgroundColor: "#004AAD", borderRadius: 18 },
                left: { backgroundColor: "#FFF", borderRadius: 18 },
            }}
        />
    );

    return (
        <SafeAreaView style={[styles.screen, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}>
            <LinearGradient colors={["#89F7FE", "#66A6FF"]} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.push("/home")} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#004AAD" />
                    </TouchableOpacity>
                    <Ionicons name="person-circle-outline" size={40} color="#004AAD" />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>AI English Tutor</Text>
                        <Text style={styles.headerStatus}>Attempts: {dailyAttempts} / {DAILY_LIMIT}</Text>
                    </View>
                </View>
            </LinearGradient>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <GiftedChat
                    messages={messages}
                    user={{ _id: 1 }}
                    renderBubble={renderBubble}
                    maxInputLength={MAX_TEXT_LENGTH}
                    placeholder="Mesajını yaz (max 200 karakter)"
                    onSend={(msgs) => {
                        const text = msgs[0].text;
                        if (text.length > MAX_TEXT_LENGTH) return;
                        setMessages((prev) => GiftedChat.append(prev, msgs));
                        sendToGemini(text);
                    }}
                />


                <View style={styles.whatsappMicContainer}>
                    {recording && (
                        <View style={styles.timerBubble}>
                            <Text style={styles.timerText}>
                                {formatTime(recordTime)} | {dailyAttempts}/{DAILY_LIMIT}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        disabled={dailyAttempts >= DAILY_LIMIT}
                        style={[
                            styles.smallMicButton,
                            recording && { backgroundColor: "#ff4757" },
                            dailyAttempts >= DAILY_LIMIT && { backgroundColor: "#aaa" },
                        ]}
                        onPressIn={startRecording}
                        onPressOut={stopRecording}
                    >
                        {isProcessing ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons name={recording ? "stop" : "mic"} size={24} color="#fff" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F0F2F5" },
    header: { paddingBottom: 15, paddingHorizontal: 20 },
    headerContent: { flexDirection: "row", alignItems: "center", marginTop: 10 },
    headerTextContainer: { marginLeft: 10 },
    headerTitle: { fontSize: 18, fontWeight: "bold", color: "#004AAD" },
    headerStatus: { fontSize: 12, color: "#004AAD" },
    backButton: { marginRight: 10, padding: 5 },
    whatsappMicContainer: { position: "absolute", right: 10, bottom: 20, flexDirection: "row", alignItems: "center" },
    smallMicButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#004AAD", justifyContent: "center", alignItems: "center" },
    timerBubble: { backgroundColor: "rgba(0,0,0,0.6)", padding: 6, borderRadius: 10, marginRight: 6 },
    timerText: { color: "#fff", fontSize: 11 },
});
