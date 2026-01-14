import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Ders verileri - A1'den C2'ye kadar
const LESSONS_DATA = {
    A1: {
        title: "A1 - Başlangıç",
        color: "#4CAF50",
        lessons: [
            {
                id: 1,
                title: "Selamlaşma",
                description: "Hello, Hi, Good morning...",
                content: [
                    { en: "Hello", tr: "Merhaba" },
                    { en: "Good morning", tr: "Günaydın" },
                    { en: "Good evening", tr: "İyi akşamlar" },
                    { en: "How are you?", tr: "Nasılsın?" },
                    { en: "I'm fine, thank you", tr: "İyiyim, teşekkürler" },
                    { en: "Nice to meet you", tr: "Tanıştığımıza memnun oldum" },
                ],
            },
            {
                id: 2,
                title: "Sayılar",
                description: "1-100 arası sayılar",
                content: [
                    { en: "One", tr: "Bir" },
                    { en: "Two", tr: "İki" },
                    { en: "Three", tr: "Üç" },
                    { en: "Ten", tr: "On" },
                    { en: "Twenty", tr: "Yirmi" },
                    { en: "One hundred", tr: "Yüz" },
                ],
            },
            {
                id: 3,
                title: "Renkler",
                description: "Temel renkler",
                content: [
                    { en: "Red", tr: "Kırmızı" },
                    { en: "Blue", tr: "Mavi" },
                    { en: "Green", tr: "Yeşil" },
                    { en: "Yellow", tr: "Sarı" },
                    { en: "Black", tr: "Siyah" },
                    { en: "White", tr: "Beyaz" },
                ],
            },
            {
                id: 4,
                title: "Aile",
                description: "Aile üyeleri",
                content: [
                    { en: "Mother", tr: "Anne" },
                    { en: "Father", tr: "Baba" },
                    { en: "Sister", tr: "Kız kardeş" },
                    { en: "Brother", tr: "Erkek kardeş" },
                    { en: "Grandmother", tr: "Büyükanne" },
                    { en: "Grandfather", tr: "Büyükbaba" },
                ],
            },
        ],
    },
    A2: {
        title: "A2 - Temel",
        color: "#8BC34A",
        lessons: [
            {
                id: 5,
                title: "Günlük Rutinler",
                description: "Daily routines",
                content: [
                    { en: "I wake up at 7 AM", tr: "Sabah 7'de uyanırım" },
                    { en: "I have breakfast", tr: "Kahvaltı yaparım" },
                    { en: "I go to work", tr: "İşe giderim" },
                    { en: "I come home", tr: "Eve gelirim" },
                    { en: "I watch TV", tr: "TV izlerim" },
                    { en: "I go to bed", tr: "Yatağa giderim" },
                ],
            },
            {
                id: 6,
                title: "Alışveriş",
                description: "Shopping phrases",
                content: [
                    { en: "How much is this?", tr: "Bu ne kadar?" },
                    { en: "I would like to buy", tr: "Satın almak istiyorum" },
                    { en: "Do you have...?", tr: "...var mı?" },
                    { en: "Too expensive", tr: "Çok pahalı" },
                    { en: "I'll take it", tr: "Bunu alacağım" },
                    { en: "Can I pay by card?", tr: "Kartla ödeyebilir miyim?" },
                ],
            },
            {
                id: 7,
                title: "Yön Tarifi",
                description: "Giving directions",
                content: [
                    { en: "Turn left", tr: "Sola dön" },
                    { en: "Turn right", tr: "Sağa dön" },
                    { en: "Go straight", tr: "Düz git" },
                    { en: "It's next to", tr: "...yanında" },
                    { en: "It's behind", tr: "...arkasında" },
                    { en: "It's in front of", tr: "...önünde" },
                ],
            },
        ],
    },
    B1: {
        title: "B1 - Orta",
        color: "#FFC107",
        lessons: [
            {
                id: 8,
                title: "İş Görüşmesi",
                description: "Job interview phrases",
                content: [
                    { en: "I have 5 years of experience", tr: "5 yıllık deneyimim var" },
                    { en: "I am a team player", tr: "Takım oyuncusuyum" },
                    { en: "My strengths are...", tr: "Güçlü yanlarım..." },
                    { en: "I am eager to learn", tr: "Öğrenmeye hevesliyim" },
                    { en: "What is the salary?", tr: "Maaş nedir?" },
                    { en: "When can I start?", tr: "Ne zaman başlayabilirim?" },
                ],
            },
            {
                id: 9,
                title: "Seyahat",
                description: "Travel vocabulary",
                content: [
                    { en: "I'd like to book a room", tr: "Bir oda ayırtmak istiyorum" },
                    { en: "Is breakfast included?", tr: "Kahvaltı dahil mi?" },
                    { en: "Where is the airport?", tr: "Havalimanı nerede?" },
                    { en: "I need a taxi", tr: "Taksiye ihtiyacım var" },
                    { en: "My flight is delayed", tr: "Uçuşum ertelendi" },
                    { en: "I lost my luggage", tr: "Bagajımı kaybettim" },
                ],
            },
            {
                id: 10,
                title: "Sağlık",
                description: "Health and medical",
                content: [
                    { en: "I have a headache", tr: "Başım ağrıyor" },
                    { en: "I need a doctor", tr: "Doktora ihtiyacım var" },
                    { en: "I'm allergic to...", tr: "...alerjim var" },
                    { en: "Take this medicine", tr: "Bu ilacı al" },
                    { en: "How do you feel?", tr: "Nasıl hissediyorsun?" },
                    { en: "Get well soon", tr: "Geçmiş olsun" },
                ],
            },
        ],
    },
    B2: {
        title: "B2 - Orta Üstü",
        color: "#FF9800",
        lessons: [
            {
                id: 11,
                title: "İş İngilizcesi",
                description: "Business English",
                content: [
                    { en: "Let's schedule a meeting", tr: "Bir toplantı planlayalım" },
                    { en: "Please find attached", tr: "Ekte bulabilirsiniz" },
                    { en: "I look forward to hearing from you", tr: "Sizden haber bekliyorum" },
                    { en: "As per our discussion", tr: "Görüşmemize istinaden" },
                    { en: "Please advise", tr: "Lütfen bilgilendiriniz" },
                    { en: "Best regards", tr: "Saygılarımla" },
                ],
            },
            {
                id: 12,
                title: "Tartışma",
                description: "Debate and discussion",
                content: [
                    { en: "In my opinion", tr: "Bence" },
                    { en: "I disagree because", tr: "Katılmıyorum çünkü" },
                    { en: "On the other hand", tr: "Öte yandan" },
                    { en: "That's a valid point", tr: "Bu geçerli bir nokta" },
                    { en: "Let me clarify", tr: "Açıklayayım" },
                    { en: "To sum up", tr: "Özetlemek gerekirse" },
                ],
            },
        ],
    },
    C1: {
        title: "C1 - İleri",
        color: "#FF5722",
        lessons: [
            {
                id: 13,
                title: "Deyimler",
                description: "Common idioms",
                content: [
                    { en: "Break the ice", tr: "Buzları kırmak" },
                    { en: "Hit the nail on the head", tr: "Tam isabet" },
                    { en: "A piece of cake", tr: "Çocuk oyuncağı" },
                    { en: "Under the weather", tr: "Keyifsiz/hasta" },
                    { en: "Cost an arm and a leg", tr: "Çok pahalı" },
                    { en: "Kill two birds with one stone", tr: "Bir taşla iki kuş vurmak" },
                ],
            },
            {
                id: 14,
                title: "Akademik Yazım",
                description: "Academic writing",
                content: [
                    { en: "This essay will examine", tr: "Bu makale inceleyecek" },
                    { en: "According to research", tr: "Araştırmaya göre" },
                    { en: "Furthermore", tr: "Ayrıca, bunun yanı sıra" },
                    { en: "In conclusion", tr: "Sonuç olarak" },
                    { en: "It can be argued that", tr: "...savunulabilir" },
                    { en: "The evidence suggests", tr: "Kanıtlar gösteriyor ki" },
                ],
            },
        ],
    },
    C2: {
        title: "C2 - Uzman",
        color: "#9C27B0",
        lessons: [
            {
                id: 15,
                title: "Edebi İfadeler",
                description: "Literary expressions",
                content: [
                    { en: "Metaphorically speaking", tr: "Mecazi olarak" },
                    { en: "The crux of the matter", tr: "Meselenin özü" },
                    { en: "To play devil's advocate", tr: "Karşı görüşü savunmak" },
                    { en: "A paradigm shift", tr: "Paradigma değişimi" },
                    { en: "Nuanced perspective", tr: "Nüanslı bakış açısı" },
                    { en: "Eloquently expressed", tr: "Belagatle ifade edilmiş" },
                ],
            },
            {
                id: 16,
                title: "İleri Düzey Kelimeler",
                description: "Advanced vocabulary",
                content: [
                    { en: "Ubiquitous", tr: "Her yerde bulunan" },
                    { en: "Ephemeral", tr: "Geçici, kısa ömürlü" },
                    { en: "Serendipity", tr: "Beklenmedik güzel keşif" },
                    { en: "Eloquent", tr: "Belagatlı, güzel konuşan" },
                    { en: "Meticulous", tr: "Titiz, dikkatli" },
                    { en: "Pragmatic", tr: "Pragmatik, pratik" },
                ],
            },
        ],
    },
};

export default function Lessons() {
    const router = useRouter();
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const openLesson = (lesson: any) => {
        setSelectedLesson(lesson);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={["#89F7FE", "#66A6FF"]} style={styles.gradient}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#004AAD" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Dersler</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scroll}>
                    {/* Seviye Seçimi */}
                    <Text style={styles.sectionTitle}>Seviye Seçin</Text>
                    <View style={styles.levelContainer}>
                        {Object.entries(LESSONS_DATA).map(([key, data]) => (
                            <TouchableOpacity
                                key={key}
                                style={[
                                    styles.levelCard,
                                    { backgroundColor: data.color },
                                    selectedLevel === key && styles.levelCardSelected,
                                ]}
                                onPress={() => setSelectedLevel(selectedLevel === key ? null : key)}
                            >
                                <Text style={styles.levelText}>{key}</Text>
                                <Text style={styles.levelSubtext}>{data.title.split(" - ")[1]}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Seçilen Seviyenin Dersleri */}
                    {selectedLevel && (
                        <View style={styles.lessonsSection}>
                            <Text style={styles.sectionTitle}>
                                {LESSONS_DATA[selectedLevel as keyof typeof LESSONS_DATA].title} Dersleri
                            </Text>
                            {LESSONS_DATA[selectedLevel as keyof typeof LESSONS_DATA].lessons.map((lesson) => (
                                <TouchableOpacity
                                    key={lesson.id}
                                    style={styles.lessonCard}
                                    onPress={() => openLesson(lesson)}
                                >
                                    <View style={styles.lessonInfo}>
                                        <Text style={styles.lessonTitle}>{lesson.title}</Text>
                                        <Text style={styles.lessonDesc}>{lesson.description}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={24} color="#004AAD" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {!selectedLevel && (
                        <Text style={styles.hint}>👆 Yukarıdan bir seviye seçin</Text>
                    )}
                </ScrollView>

                {/* Ders İçeriği Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{selectedLesson?.title}</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close" size={28} color="#004AAD" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={styles.modalScroll}>
                                {selectedLesson?.content.map((item: any, index: number) => (
                                    <View key={index} style={styles.wordCard}>
                                        <Text style={styles.wordEn}>{item.en}</Text>
                                        <Text style={styles.wordTr}>{item.tr}</Text>
                                    </View>
                                ))}
                            </ScrollView>

                            <TouchableOpacity
                                style={styles.practiceBtn}
                                onPress={() => {
                                    setModalVisible(false);
                                    router.push("/quiz");
                                }}
                            >
                                <Text style={styles.practiceBtnText}>Quiz ile Pratik Yap</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradient: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
    },
    backBtn: { padding: 5 },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#004AAD",
    },
    scroll: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#004AAD",
        marginBottom: 15,
    },
    levelContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    levelCard: {
        width: "30%",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 10,
    },
    levelCardSelected: {
        borderWidth: 3,
        borderColor: "#004AAD",
    },
    levelText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    levelSubtext: {
        fontSize: 10,
        color: "#fff",
        marginTop: 2,
    },
    lessonsSection: {
        marginTop: 10,
    },
    lessonCard: {
        backgroundColor: "rgba(255,255,255,0.7)",
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    lessonInfo: { flex: 1 },
    lessonTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#004AAD",
    },
    lessonDesc: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    hint: {
        textAlign: "center",
        color: "#004AAD",
        fontSize: 16,
        marginTop: 40,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: "80%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#004AAD",
    },
    modalScroll: {
        maxHeight: 400,
    },
    wordCard: {
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    wordEn: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#004AAD",
    },
    wordTr: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    practiceBtn: {
        backgroundColor: "#004AAD",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        marginTop: 15,
    },
    practiceBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
