export interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
  example?: string;
}

export const flashcards: Flashcard[] = [
  // Character - Basic
  {
    id: 1,
    front: "Persistence",
    back: "Azim, kararlılık",
    category: "Character",
    example: "Başarı azim gerektirir.",
  },
  {
    id: 2,
    front: "Courage",
    back: "Cesaret",
    category: "Character",
    example: "Doğruyu söylemek cesaret gerektirir.",
  },
  {
    id: 3,
    front: "Honesty",
    back: "Dürüstlük",
    category: "Character",
    example: "Dürüstlük her zaman en iyi politikadır.",
  },
  {
    id: 4,
    front: "Patience",
    back: "Sabır",
    category: "Character",
    example: "Sabır başarının anahtarıdır.",
  },
  {
    id: 5,
    front: "Kindness",
    back: "Nezaket",
    category: "Character",
    example: "Nezaket hiçbir şeye mal olmaz.",
  },

  // Character - Advanced
  {
    id: 6,
    front: "Resilience",
    back: "Dayanıklılık, toparlanma gücü",
    category: "Character",
    example: "Zorluklar karşısında dayanıklılık göstermek önemlidir.",
  },
  {
    id: 7,
    front: "Humility",
    back: "Alçakgönüllülük",
    category: "Character",
    example: "Gerçek liderler alçakgönüllülükle tanınır.",
  },
  {
    id: 8,
    front: "Integrity",
    back: "Doğruluk, dürüstlük",
    category: "Character",
    example: "İş hayatında doğruluk çok önemlidir.",
  },

  // Abstract - Basic
  {
    id: 9,
    front: "Freedom",
    back: "Özgürlük",
    category: "Abstract",
    example: "Özgürlük temel bir insan hakkıdır.",
  },
  {
    id: 10,
    front: "Wisdom",
    back: "Bilgelik",
    category: "Abstract",
    example: "Bilgelik deneyimle gelir.",
  },
  {
    id: 11,
    front: "Justice",
    back: "Adalet",
    category: "Abstract",
    example: "Adalet herkes için olmalıdır.",
  },
  {
    id: 12,
    front: "Peace",
    back: "Barış",
    category: "Abstract",
    example: "Barış içinde yaşamak istiyoruz.",
  },
  {
    id: 13,
    front: "Truth",
    back: "Gerçek",
    category: "Abstract",
    example: "Gerçek her zaman ortaya çıkar.",
  },

  // Abstract - Advanced
  {
    id: 14,
    front: "Ambiguity",
    back: "Belirsizlik, muğlaklık",
    category: "Abstract",
    example: "Hayat bazen belirsizliklerle doludur.",
  },
  {
    id: 15,
    front: "Paradox",
    back: "Çelişki, paradoks",
    category: "Abstract",
    example: "Bu durum ilginç bir çelişki içeriyor.",
  },
  {
    id: 16,
    front: "Phenomenon",
    back: "Fenomen, olgu",
    category: "Abstract",
    example: "Küresel ısınma ciddi bir olgudur.",
  },
  {
    id: 17,
    front: "Hypothesis",
    back: "Hipotez, varsayım",
    category: "Abstract",
    example: "Bilimsel araştırmalar hipotezle başlar.",
  },

  // Adjective - Basic
  {
    id: 18,
    front: "Beautiful",
    back: "Güzel",
    category: "Adjective",
    example: "Onun güzel bir gülümsemesi var.",
  },
  {
    id: 19,
    front: "Strong",
    back: "Güçlü",
    category: "Adjective",
    example: "O çok güçlü bir insan.",
  },
  {
    id: 20,
    front: "Fast",
    back: "Hızlı",
    category: "Adjective",
    example: "Bu araba çok hızlı.",
  },
  {
    id: 21,
    front: "Smart",
    back: "Akıllı",
    category: "Adjective",
    example: "O çok akıllı bir öğrenci.",
  },
  {
    id: 22,
    front: "Tall",
    back: "Uzun",
    category: "Adjective",
    example: "Babam çok uzun boylu.",
  },

  // Adjective - Advanced
  {
    id: 23,
    front: "Sophisticated",
    back: "Sofistike, karmaşık",
    category: "Adjective",
    example: "Bu çok sofistike bir sistem.",
  },
  {
    id: 24,
    front: "Ambivalent",
    back: "Kararsız, ikircikli",
    category: "Adjective",
    example: "Bu konuda kararsız hissediyorum.",
  },
  {
    id: 25,
    front: "Ubiquitous",
    back: "Her yerde bulunan, yaygın",
    category: "Adjective",
    example: "Akıllı telefonlar artık her yerde yaygın.",
  },
  {
    id: 26,
    front: "Meticulous",
    back: "Titiz, dikkatli",
    category: "Adjective",
    example: "O çok titiz bir çalışandır.",
  },

  // Emotion - Basic
  {
    id: 27,
    front: "Happy",
    back: "Mutlu",
    category: "Emotion",
    example: "Seni gördüğüm için mutluyum.",
  },
  {
    id: 28,
    front: "Hope",
    back: "Umut",
    category: "Emotion",
    example: "Umudunu asla kaybetme.",
  },
  {
    id: 29,
    front: "Sad",
    back: "Üzgün",
    category: "Emotion",
    example: "Bugün biraz üzgün hissediyorum.",
  },
  {
    id: 30,
    front: "Angry",
    back: "Kızgın",
    category: "Emotion",
    example: "Neden bu kadar kızgınsın?",
  },
  {
    id: 31,
    front: "Excited",
    back: "Heyecanlı",
    category: "Emotion",
    example: "Yarın için çok heyecanlıyım.",
  },
  {
    id: 32,
    front: "Love",
    back: "Aşk, sevgi",
    category: "Emotion",
    example: "Aşk hayatı güzelleştirir.",
  },

  // Emotion - Advanced
  {
    id: 33,
    front: "Melancholy",
    back: "Hüzün, melankoli",
    category: "Emotion",
    example: "Sonbahar ona melankoli hissi veriyor.",
  },
  {
    id: 34,
    front: "Nostalgic",
    back: "Nostaljik, özlem dolu",
    category: "Emotion",
    example: "Eski fotoğraflara bakınca nostaljik oldum.",
  },
  {
    id: 35,
    front: "Overwhelmed",
    back: "Bunalmış, altında ezilmiş",
    category: "Emotion",
    example: "İş yükünden dolayı bunalmış hissediyorum.",
  },
  {
    id: 36,
    front: "Anxious",
    back: "Endişeli, kaygılı",
    category: "Emotion",
    example: "Sınav öncesi çok endişeliyim.",
  },

  // Nature - Basic
  {
    id: 37,
    front: "Water",
    back: "Su",
    category: "Nature",
    example: "Lütfen bana bir bardak su getir.",
  },
  {
    id: 38,
    front: "Fire",
    back: "Ateş",
    category: "Nature",
    example: "Ateş tehlikeli olabilir.",
  },
  {
    id: 39,
    front: "Earth",
    back: "Toprak, Dünya",
    category: "Nature",
    example: "Dünya bizim evimizdir.",
  },
  {
    id: 40,
    front: "Sky",
    back: "Gökyüzü",
    category: "Nature",
    example: "Gökyüzü bugün çok mavi.",
  },
  {
    id: 41,
    front: "Tree",
    back: "Ağaç",
    category: "Nature",
    example: "Bahçede büyük bir ağaç var.",
  },
  {
    id: 42,
    front: "Flower",
    back: "Çiçek",
    category: "Nature",
    example: "Bu çiçekler çok güzel kokuyor.",
  },
  {
    id: 43,
    front: "Mountain",
    back: "Dağ",
    category: "Nature",
    example: "Dağa tırmanmak istiyorum.",
  },

  // Nature - Advanced
  {
    id: 44,
    front: "Ecosystem",
    back: "Ekosistem",
    category: "Nature",
    example: "Ormanlar karmaşık ekosistemlere ev sahipliği yapar.",
  },
  {
    id: 45,
    front: "Biodiversity",
    back: "Biyoçeşitlilik",
    category: "Nature",
    example: "Biyoçeşitlilik doğal dengeyi korur.",
  },
  {
    id: 46,
    front: "Atmosphere",
    back: "Atmosfer",
    category: "Nature",
    example: "Dünya'nın atmosferi hayat için gereklidir.",
  },

  // Object - Basic
  {
    id: 47,
    front: "Book",
    back: "Kitap",
    category: "Object",
    example: "Kitap okumayı seviyorum.",
  },
  {
    id: 48,
    front: "Table",
    back: "Masa",
    category: "Object",
    example: "Masanın üstünde bir bilgisayar var.",
  },
  {
    id: 49,
    front: "Chair",
    back: "Sandalye",
    category: "Object",
    example: "Lütfen sandalyeye oturun.",
  },
  {
    id: 50,
    front: "Phone",
    back: "Telefon",
    category: "Object",
    example: "Telefonum nerede?",
  },
  {
    id: 51,
    front: "Computer",
    back: "Bilgisayar",
    category: "Object",
    example: "Bilgisayar çalışmıyor.",
  },
  {
    id: 52,
    front: "Door",
    back: "Kapı",
    category: "Object",
    example: "Kapıyı kapatır mısın?",
  },
  {
    id: 53,
    front: "Window",
    back: "Pencere",
    category: "Object",
    example: "Pencereyi aç lütfen.",
  },

  // Greeting - Basic
  {
    id: 54,
    front: "Hello",
    back: "Merhaba",
    category: "Greeting",
    example: "Merhaba, nasılsın?",
  },
  {
    id: 55,
    front: "Thank you",
    back: "Teşekkürler",
    category: "Greeting",
    example: "Yardımın için teşekkürler.",
  },
  {
    id: 56,
    front: "Goodbye",
    back: "Güle güle",
    category: "Greeting",
    example: "Hoşça kal, yarın görüşürüz!",
  },
  {
    id: 57,
    front: "Please",
    back: "Lütfen",
    category: "Greeting",
    example: "Lütfen bana yardım eder misin?",
  },
  {
    id: 58,
    front: "Sorry",
    back: "Özür dilerim",
    category: "Greeting",
    example: "Özür dilerim, geç kaldım.",
  },
  {
    id: 59,
    front: "Welcome",
    back: "Hoş geldiniz",
    category: "Greeting",
    example: "Evimize hoş geldiniz!",
  },
  {
    id: 60,
    front: "Good morning",
    back: "Günaydın",
    category: "Greeting",
    example: "Günaydın, iyi uykular uyudun mu?",
  },
  {
    id: 61,
    front: "Good night",
    back: "İyi geceler",
    category: "Greeting",
    example: "İyi geceler, tatlı rüyalar!",
  },

  // Verb - Basic
  {
    id: 62,
    front: "Run",
    back: "Koşmak",
    category: "Verb",
    example: "Her sabah koşmayı seviyorum.",
  },
  {
    id: 63,
    front: "Eat",
    back: "Yemek",
    category: "Verb",
    example: "Akşam yemeğini yedin mi?",
  },
  {
    id: 64,
    front: "Sleep",
    back: "Uyumak",
    category: "Verb",
    example: "Erken uyumak sağlıklıdır.",
  },
  {
    id: 65,
    front: "Read",
    back: "Okumak",
    category: "Verb",
    example: "Her gün kitap okuyorum.",
  },
  {
    id: 66,
    front: "Write",
    back: "Yazmak",
    category: "Verb",
    example: "Mektup yazmayı seviyorum.",
  },
  {
    id: 67,
    front: "Speak",
    back: "Konuşmak",
    category: "Verb",
    example: "İngilizce konuşabilir misin?",
  },
  {
    id: 68,
    front: "Listen",
    back: "Dinlemek",
    category: "Verb",
    example: "Müzik dinlemek beni rahatlatıyor.",
  },

  // Verb - Advanced
  {
    id: 69,
    front: "Accomplish",
    back: "Başarmak, gerçekleştirmek",
    category: "Verb",
    example: "Hedeflerini başarmak için çalışıyor.",
  },
  {
    id: 70,
    front: "Acknowledge",
    back: "Kabul etmek, onaylamak",
    category: "Verb",
    example: "Hatalarımı kabul ediyorum.",
  },
  {
    id: 71,
    front: "Contemplate",
    back: "Düşünmek, tefekkür etmek",
    category: "Verb",
    example: "Geleceğimi düşünüyorum.",
  },
  {
    id: 72,
    front: "Elaborate",
    back: "Detaylandırmak, açıklamak",
    category: "Verb",
    example: "Bu konuyu biraz daha detaylandırır mısın?",
  },
  {
    id: 73,
    front: "Procrastinate",
    back: "Ertelemek, oyalanmak",
    category: "Verb",
    example: "İşlerimi ertelemekten vazgeçmeliyim.",
  },

  // Family
  {
    id: 74,
    front: "Mother",
    back: "Anne",
    category: "Family",
    example: "Annem harika yemekler yapar.",
  },
  {
    id: 75,
    front: "Father",
    back: "Baba",
    category: "Family",
    example: "Babam çok çalışkan biridir.",
  },
  {
    id: 76,
    front: "Sister",
    back: "Kız kardeş",
    category: "Family",
    example: "Kız kardeşim üniversitede okuyor.",
  },
  {
    id: 77,
    front: "Brother",
    back: "Erkek kardeş",
    category: "Family",
    example: "Erkek kardeşim futbol oynuyor.",
  },
  {
    id: 78,
    front: "Friend",
    back: "Arkadaş",
    category: "Family",
    example: "En yakın arkadaşımla buluştum.",
  },

  // Food
  {
    id: 79,
    front: "Bread",
    back: "Ekmek",
    category: "Food",
    example: "Kahvaltıda taze ekmek yedik.",
  },
  {
    id: 80,
    front: "Milk",
    back: "Süt",
    category: "Food",
    example: "Her sabah süt içiyorum.",
  },
  {
    id: 81,
    front: "Apple",
    back: "Elma",
    category: "Food",
    example: "Elma çok sağlıklı bir meyvedir.",
  },
  {
    id: 82,
    front: "Coffee",
    back: "Kahve",
    category: "Food",
    example: "Sabahları kahve içmeden yapamam.",
  },
  {
    id: 83,
    front: "Rice",
    back: "Pirinç",
    category: "Food",
    example: "Öğle yemeğinde pilav yedik.",
  },

  // Time
  {
    id: 84,
    front: "Today",
    back: "Bugün",
    category: "Time",
    example: "Bugün hava çok güzel.",
  },
  {
    id: 85,
    front: "Tomorrow",
    back: "Yarın",
    category: "Time",
    example: "Yarın toplantımız var.",
  },
  {
    id: 86,
    front: "Yesterday",
    back: "Dün",
    category: "Time",
    example: "Dün sinemaya gittik.",
  },
  {
    id: 87,
    front: "Now",
    back: "Şimdi",
    category: "Time",
    example: "Şimdi ne yapıyorsun?",
  },
  {
    id: 88,
    front: "Always",
    back: "Her zaman",
    category: "Time",
    example: "Her zaman senin yanındayım.",
  },

  // Business - Advanced
  {
    id: 89,
    front: "Entrepreneur",
    back: "Girişimci",
    category: "Business",
    example: "Genç girişimciler ekonomiyi canlandırıyor.",
  },
  {
    id: 90,
    front: "Acquisition",
    back: "Satın alma, devralma",
    category: "Business",
    example: "Şirket büyük bir satın alma gerçekleştirdi.",
  },
  {
    id: 91,
    front: "Stakeholder",
    back: "Paydaş",
    category: "Business",
    example: "Tüm paydaşların görüşleri önemlidir.",
  },
  {
    id: 92,
    front: "Revenue",
    back: "Gelir, hasılat",
    category: "Business",
    example: "Şirketin yıllık geliri arttı.",
  },
  {
    id: 93,
    front: "Liability",
    back: "Yükümlülük, sorumluluk",
    category: "Business",
    example: "Her şirketin yasal yükümlülükleri vardır.",
  },

  // Academic - Advanced
  {
    id: 94,
    front: "Empirical",
    back: "Deneysel, ampirik",
    category: "Academic",
    example: "Bu sonuçlar deneysel verilere dayanıyor.",
  },
  {
    id: 95,
    front: "Theoretical",
    back: "Teorik, kuramsal",
    category: "Academic",
    example: "Teorik bilgiyi pratiğe dönüştürmeliyiz.",
  },
  {
    id: 96,
    front: "Analyze",
    back: "Analiz etmek, çözümlemek",
    category: "Academic",
    example: "Verileri dikkatlice analiz ettik.",
  },
  {
    id: 97,
    front: "Synthesize",
    back: "Sentezlemek, birleştirmek",
    category: "Academic",
    example: "Farklı fikirleri sentezleyerek yeni bir teori oluşturduk.",
  },
  {
    id: 98,
    front: "Methodology",
    back: "Metodoloji, yöntem bilimi",
    category: "Academic",
    example: "Araştırmanın metodolojisi çok önemlidir.",
  },

  // Technology - Advanced
  {
    id: 99,
    front: "Algorithm",
    back: "Algoritma",
    category: "Technology",
    example: "Bu algoritma çok verimli çalışıyor.",
  },
  {
    id: 100,
    front: "Encryption",
    back: "Şifreleme",
    category: "Technology",
    example: "Veriler güvenlik için şifreleniyor.",
  },
];
