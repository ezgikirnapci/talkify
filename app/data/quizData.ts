export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export const quizQuestions: QuizQuestion[] = [
  // Character & Abstract - Basic (correctAnswer: 0, 1, 2, 3 karışık)
  {
    id: 1,
    question: "'Persistence' kelimesi ne anlama gelir?",
    options: ["Azim, kararlılık", "Sabırsızlık", "Kayıtsızlık", "Tembellik"],
    correctAnswer: 0,
    explanation: "Persistence, zorluklara rağmen devam etmek anlamına gelir.",
  },
  {
    id: 2,
    question: "'Courage' kelimesi ne anlama gelir?",
    options: ["Korku", "Üzüntü", "Mutluluk", "Cesaret"],
    correctAnswer: 3,
    explanation: "Courage, sizi korkutan bir şeyi yapabilme yeteneği anlamına gelir.",
  },
  {
    id: 3,
    question: "'Honesty' kelimesinin Türkçe karşılığı nedir?",
    options: ["Yalan", "Korku", "Dürüstlük", "Cesaret"],
    correctAnswer: 2,
    explanation: "'Honesty' dürüstlük anlamına gelir.",
  },
  {
    id: 4,
    question: "'Patience' kelimesinin Türkçe karşılığı nedir?",
    options: ["Öfke", "Heyecan", "Korku", "Sabır"],
    correctAnswer: 3,
    explanation: "Patience, sabır ve tahammül anlamına gelir.",
  },
  {
    id: 5,
    question: "'Kindness' kelimesi ne anlama gelir?",
    options: ["Nezaket", "Kaba davranış", "Kayıtsızlık", "Bencillik"],
    correctAnswer: 0,
    explanation: "Kindness, başkalarına karşı nazik ve düşünceli olmak demektir.",
  },

  // Character - Advanced
  {
    id: 6,
    question: "'Resilience' kelimesi ne anlama gelir?",
    options: ["Zayıflık", "Tembellik", "Dayanıklılık", "Korku"],
    correctAnswer: 2,
    explanation: "Resilience, zorluklar karşısında toparlanma gücü demektir.",
  },
  {
    id: 7,
    question: "'Humility' kelimesinin Türkçe karşılığı nedir?",
    options: ["Kibir", "Gurur", "Öfke", "Alçakgönüllülük"],
    correctAnswer: 3,
    explanation: "Humility, kendini büyük görmeme, alçakgönüllülük demektir.",
  },
  {
    id: 8,
    question: "'Integrity' kelimesi ne anlama gelir?",
    options: ["Doğruluk, dürüstlük", "Yalancılık", "İhanet", "Korkaklık"],
    correctAnswer: 0,
    explanation: "Integrity, ahlaki ilkelere bağlı kalma anlamına gelir.",
  },

  // Abstract
  {
    id: 9,
    question: "'Freedom' kelimesi ne anlama gelir?",
    options: ["Esaret", "Bağımlılık", "Kısıtlama", "Özgürlük"],
    correctAnswer: 3,
    explanation: "Freedom, özgürce hareket etme hakkı anlamına gelir.",
  },
  {
    id: 10,
    question: "'Wisdom' kelimesinin Türkçe karşılığı nedir?",
    options: ["Bilgelik", "Cehalet", "Aptallık", "Gençlik"],
    correctAnswer: 0,
    explanation: "Wisdom, deneyime dayanan doğru kararlar verme yeteneğidir.",
  },
  {
    id: 11,
    question: "'Justice' kelimesi ne anlama gelir?",
    options: ["Haksızlık", "Suç", "Adalet", "Ceza"],
    correctAnswer: 2,
    explanation: "Justice, adalet ve hakkaniyet anlamına gelir.",
  },
  {
    id: 12,
    question: "'Ambiguity' kelimesinin Türkçe karşılığı nedir?",
    options: ["Açıklık", "Kesinlik", "Belirsizlik", "Netlik"],
    correctAnswer: 2,
    explanation: "Ambiguity, birden fazla anlama gelebilecek belirsizlik demektir.",
  },
  {
    id: 13,
    question: "'Paradox' kelimesi ne anlama gelir?",
    options: ["Çelişki", "Uyum", "Denge", "Birlik"],
    correctAnswer: 0,
    explanation: "Paradox, çelişkili gibi görünen ama doğru olabilecek bir durumdur.",
  },
  {
    id: 14,
    question: "'Hypothesis' kelimesinin Türkçe karşılığı nedir?",
    options: ["Sonuç", "Kanıt", "Gerçek", "Varsayım"],
    correctAnswer: 3,
    explanation: "Hypothesis, test edilmek üzere öne sürülen varsayımdır.",
  },

  // Greetings
  {
    id: 15,
    question: "'Hello' kelimesinin doğru çevirisi hangisidir?",
    options: ["Güle güle", "Merhaba", "Teşekkürler", "Özür dilerim"],
    correctAnswer: 1,
    explanation: "'Hello' kelimesi Türkçe'de 'Merhaba' anlamına gelir.",
  },
  {
    id: 16,
    question: "'Thank you' kelimesinin doğru çevirisi hangisidir?",
    options: ["Merhaba", "Lütfen", "Özür dilerim", "Teşekkürler"],
    correctAnswer: 3,
    explanation: "'Thank you' kelimesi Türkçe'de 'Teşekkürler' anlamına gelir.",
  },
  {
    id: 17,
    question: "'Goodbye' kelimesinin doğru çevirisi hangisidir?",
    options: ["Merhaba", "Teşekkürler", "Güle güle", "Lütfen"],
    correctAnswer: 2,
    explanation: "'Goodbye' kelimesi Türkçe'de 'Güle güle' anlamına gelir.",
  },
  {
    id: 18,
    question: "'Please' kelimesi ne anlama gelir?",
    options: ["Lütfen", "Teşekkürler", "Özür dilerim", "Merhaba"],
    correctAnswer: 0,
    explanation: "'Please' rica ederken kullanılan 'Lütfen' anlamına gelir.",
  },
  {
    id: 19,
    question: "'Sorry' kelimesinin Türkçe karşılığı nedir?",
    options: ["Merhaba", "Teşekkürler", "Lütfen", "Özür dilerim"],
    correctAnswer: 3,
    explanation: "'Sorry' özür dilemek için kullanılır.",
  },

  // Adjectives - Basic
  {
    id: 20,
    question: "Hangi kelime 'Beautiful' anlamına gelir?",
    options: ["Çirkin", "Güzel", "Uzun", "Kısa"],
    correctAnswer: 1,
    explanation: "'Beautiful' güzel anlamına gelir.",
  },
  {
    id: 21,
    question: "'Strong' kelimesi ne anlama gelir?",
    options: ["Güçlü", "Zayıf", "Yavaş", "Küçük"],
    correctAnswer: 0,
    explanation: "'Strong' güçlü, kuvvetli anlamına gelir.",
  },
  {
    id: 22,
    question: "'Fast' kelimesinin Türkçe karşılığı nedir?",
    options: ["Yavaş", "Uzun", "Kısa", "Hızlı"],
    correctAnswer: 3,
    explanation: "'Fast' hızlı anlamına gelir.",
  },
  {
    id: 23,
    question: "'Smart' kelimesi ne anlama gelir?",
    options: ["Aptal", "Tembel", "Akıllı", "Yorgun"],
    correctAnswer: 2,
    explanation: "'Smart' akıllı, zeki anlamına gelir.",
  },

  // Adjectives - Advanced
  {
    id: 24,
    question: "'Sophisticated' kelimesinin Türkçe karşılığı nedir?",
    options: ["Basit", "İlkel", "Sofistike, karmaşık", "Kolay"],
    correctAnswer: 2,
    explanation: "Sophisticated, gelişmiş ve karmaşık anlamına gelir.",
  },
  {
    id: 25,
    question: "'Ambivalent' kelimesi ne anlama gelir?",
    options: ["Emin", "Kararlı", "Net", "Kararsız, ikircikli"],
    correctAnswer: 3,
    explanation: "Ambivalent, iki zıt duyguyu aynı anda hissetmek demektir.",
  },
  {
    id: 26,
    question: "'Ubiquitous' kelimesinin Türkçe karşılığı nedir?",
    options: ["Her yerde bulunan", "Nadir", "Benzersiz", "Gizli"],
    correctAnswer: 0,
    explanation: "Ubiquitous, her yerde bulunan, yaygın anlamına gelir.",
  },
  {
    id: 27,
    question: "'Meticulous' kelimesi ne anlama gelir?",
    options: ["Dikkatsiz", "Titiz, dikkatli", "Tembel", "Aceleci"],
    correctAnswer: 1,
    explanation: "Meticulous, çok dikkatli ve titiz olmak demektir.",
  },

  // Emotions
  {
    id: 28,
    question: "Hangi kelime 'Happy' anlamına gelir?",
    options: ["Üzgün", "Kızgın", "Yorgun", "Mutlu"],
    correctAnswer: 3,
    explanation: "'Happy' mutlu anlamına gelir.",
  },
  {
    id: 29,
    question: "'Sad' kelimesi ne anlama gelir?",
    options: ["Üzgün", "Mutlu", "Kızgın", "Heyecanlı"],
    correctAnswer: 0,
    explanation: "'Sad' üzgün anlamına gelir.",
  },
  {
    id: 30,
    question: "'Angry' kelimesinin Türkçe karşılığı nedir?",
    options: ["Mutlu", "Sakin", "Kızgın", "Üzgün"],
    correctAnswer: 2,
    explanation: "'Angry' kızgın, öfkeli anlamına gelir.",
  },
  {
    id: 31,
    question: "'Melancholy' kelimesi ne anlama gelir?",
    options: ["Mutluluk", "Heyecan", "Hüzün, melankoli", "Neşe"],
    correctAnswer: 2,
    explanation: "Melancholy, derin üzüntü ve hüzün hissidir.",
  },
  {
    id: 32,
    question: "'Overwhelmed' kelimesinin Türkçe karşılığı nedir?",
    options: ["Rahat", "Sakin", "Bunalmış", "Huzurlu"],
    correctAnswer: 2,
    explanation: "Overwhelmed, duygusal veya fiziksel olarak bunalmış olmak demektir.",
  },
  {
    id: 33,
    question: "'Anxious' kelimesi ne anlama gelir?",
    options: ["Sakin", "Rahat", "Mutlu", "Endişeli, kaygılı"],
    correctAnswer: 3,
    explanation: "Anxious, gelecek hakkında endişeli olmak demektir.",
  },

  // Nature
  {
    id: 34,
    question: "'Su' kelimesinin İngilizce karşılığı nedir?",
    options: ["Fire", "Earth", "Air", "Water"],
    correctAnswer: 3,
    explanation: "'Su' kelimesi İngilizce'de 'Water' anlamına gelir.",
  },
  {
    id: 35,
    question: "'Fire' kelimesi ne anlama gelir?",
    options: ["Ateş", "Su", "Toprak", "Hava"],
    correctAnswer: 0,
    explanation: "'Fire' ateş anlamına gelir.",
  },
  {
    id: 36,
    question: "'Ecosystem' kelimesinin Türkçe karşılığı nedir?",
    options: ["Ekonomi", "Ekosistem", "Egzersiz", "Ekoloji"],
    correctAnswer: 1,
    explanation: "Ecosystem, canlıların ve çevrelerinin oluşturduğu sistemdir.",
  },
  {
    id: 37,
    question: "'Biodiversity' kelimesi ne anlama gelir?",
    options: ["Biyografi", "Biyoloji", "Biyoçeşitlilik", "Biyoteknoloji"],
    correctAnswer: 2,
    explanation: "Biodiversity, bir bölgedeki canlı türlerinin çeşitliliğidir.",
  },

  // Objects
  {
    id: 38,
    question: "'Kitap' kelimesinin İngilizce karşılığı nedir?",
    options: ["Book", "Table", "Chair", "Window"],
    correctAnswer: 0,
    explanation: "'Kitap' kelimesi İngilizce'de 'Book' anlamına gelir.",
  },
  {
    id: 39,
    question: "'Table' kelimesi ne anlama gelir?",
    options: ["Sandalye", "Kapı", "Pencere", "Masa"],
    correctAnswer: 3,
    explanation: "'Table' masanın İngilizce karşılığıdır.",
  },
  {
    id: 40,
    question: "'Chair' kelimesinin Türkçe karşılığı nedir?",
    options: ["Masa", "Koltuk", "Sandalye", "Yatak"],
    correctAnswer: 2,
    explanation: "'Chair' sandalye anlamına gelir.",
  },
  {
    id: 41,
    question: "'Computer' kelimesi ne anlama gelir?",
    options: ["Bilgisayar", "Telefon", "Tablet", "Televizyon"],
    correctAnswer: 0,
    explanation: "'Computer' bilgisayar demektir.",
  },

  // Verbs - Basic
  {
    id: 42,
    question: "'Run' kelimesi ne anlama gelir?",
    options: ["Yürümek", "Oturmak", "Yatmak", "Koşmak"],
    correctAnswer: 3,
    explanation: "'Run' koşmak anlamına gelir.",
  },
  {
    id: 43,
    question: "'Eat' kelimesinin Türkçe karşılığı nedir?",
    options: ["Yemek yemek", "İçmek", "Uyumak", "Okumak"],
    correctAnswer: 0,
    explanation: "'Eat' yemek yemek anlamına gelir.",
  },
  {
    id: 44,
    question: "'Sleep' kelimesi ne anlama gelir?",
    options: ["Uyanmak", "Koşmak", "Uyumak", "Yürümek"],
    correctAnswer: 2,
    explanation: "'Sleep' uyumak anlamına gelir.",
  },
  {
    id: 45,
    question: "'Read' kelimesinin Türkçe karşılığı nedir?",
    options: ["Yazmak", "Okumak", "Dinlemek", "Konuşmak"],
    correctAnswer: 1,
    explanation: "'Read' okumak anlamına gelir.",
  },

  // Verbs - Advanced
  {
    id: 46,
    question: "'Accomplish' kelimesi ne anlama gelir?",
    options: ["Başarısız olmak", "Vazgeçmek", "Başarmak", "Ertelemek"],
    correctAnswer: 2,
    explanation: "Accomplish, bir şeyi başarıyla tamamlamak demektir.",
  },
  {
    id: 47,
    question: "'Acknowledge' kelimesinin Türkçe karşılığı nedir?",
    options: ["Reddetmek", "İnkar etmek", "Görmezden gelmek", "Kabul etmek"],
    correctAnswer: 3,
    explanation: "Acknowledge, bir şeyin doğru olduğunu kabul etmek demektir.",
  },
  {
    id: 48,
    question: "'Contemplate' kelimesi ne anlama gelir?",
    options: ["Düşünmek, tefekkür etmek", "Unutmak", "Görmezden gelmek", "Acele etmek"],
    correctAnswer: 0,
    explanation: "Contemplate, derin düşünmek anlamına gelir.",
  },
  {
    id: 49,
    question: "'Procrastinate' kelimesinin Türkçe karşılığı nedir?",
    options: ["Acele etmek", "Erken başlamak", "Ertelemek", "Tamamlamak"],
    correctAnswer: 2,
    explanation: "Procrastinate, yapılması gereken işleri ertelemek demektir.",
  },
  {
    id: 50,
    question: "'Elaborate' kelimesi ne anlama gelir?",
    options: ["Kısaltmak", "Özetlemek", "Silmek", "Detaylandırmak"],
    correctAnswer: 3,
    explanation: "Elaborate, bir konuyu daha fazla detayla açıklamak demektir.",
  },

  // Family
  {
    id: 51,
    question: "'Mother' kelimesinin Türkçe karşılığı nedir?",
    options: ["Anne", "Baba", "Kardeş", "Teyze"],
    correctAnswer: 0,
    explanation: "'Mother' anne anlamına gelir.",
  },
  {
    id: 52,
    question: "'Father' kelimesi ne anlama gelir?",
    options: ["Anne", "Amca", "Dede", "Baba"],
    correctAnswer: 3,
    explanation: "'Father' baba anlamına gelir.",
  },
  {
    id: 53,
    question: "'Friend' kelimesinin Türkçe karşılığı nedir?",
    options: ["Düşman", "Yabancı", "Arkadaş", "Komşu"],
    correctAnswer: 2,
    explanation: "'Friend' arkadaş anlamına gelir.",
  },

  // Food
  {
    id: 54,
    question: "'Bread' kelimesi ne anlama gelir?",
    options: ["Ekmek", "Su", "Süt", "Peynir"],
    correctAnswer: 0,
    explanation: "'Bread' ekmek anlamına gelir.",
  },
  {
    id: 55,
    question: "'Milk' kelimesinin Türkçe karşılığı nedir?",
    options: ["Su", "Çay", "Kahve", "Süt"],
    correctAnswer: 3,
    explanation: "'Milk' süt anlamına gelir.",
  },
  {
    id: 56,
    question: "'Coffee' kelimesi ne anlama gelir?",
    options: ["Çay", "Kahve", "Su", "Süt"],
    correctAnswer: 1,
    explanation: "'Coffee' kahve anlamına gelir.",
  },

  // Time
  {
    id: 57,
    question: "'Today' kelimesi ne anlama gelir?",
    options: ["Bugün", "Dün", "Yarın", "Şimdi"],
    correctAnswer: 0,
    explanation: "'Today' bugün anlamına gelir.",
  },
  {
    id: 58,
    question: "'Tomorrow' kelimesinin Türkçe karşılığı nedir?",
    options: ["Dün", "Bugün", "Geçen hafta", "Yarın"],
    correctAnswer: 3,
    explanation: "'Tomorrow' yarın anlamına gelir.",
  },
  {
    id: 59,
    question: "'Yesterday' kelimesi ne anlama gelir?",
    options: ["Bugün", "Yarın", "Dün", "Şimdi"],
    correctAnswer: 2,
    explanation: "'Yesterday' dün anlamına gelir.",
  },
  {
    id: 60,
    question: "'Always' kelimesinin Türkçe karşılığı nedir?",
    options: ["Asla", "Bazen", "Her zaman", "Nadiren"],
    correctAnswer: 2,
    explanation: "'Always' her zaman anlamına gelir.",
  },

  // Business - Advanced
  {
    id: 61,
    question: "'Entrepreneur' kelimesi ne anlama gelir?",
    options: ["Çalışan", "Müdür", "Danışman", "Girişimci"],
    correctAnswer: 3,
    explanation: "Entrepreneur, iş kuran ve yöneten kişidir.",
  },
  {
    id: 62,
    question: "'Acquisition' kelimesinin Türkçe karşılığı nedir?",
    options: ["Satın alma, devralma", "Satış", "Kayıp", "İflas"],
    correctAnswer: 0,
    explanation: "Acquisition, bir şirketi veya varlığı satın almak demektir.",
  },
  {
    id: 63,
    question: "'Stakeholder' kelimesi ne anlama gelir?",
    options: ["Rakip", "Düşman", "Paydaş", "Yabancı"],
    correctAnswer: 2,
    explanation: "Stakeholder, bir projede çıkarı olan kişi veya gruptur.",
  },
  {
    id: 64,
    question: "'Revenue' kelimesinin Türkçe karşılığı nedir?",
    options: ["Gider", "Borç", "Zarar", "Gelir, hasılat"],
    correctAnswer: 3,
    explanation: "Revenue, bir işletmenin kazandığı toplam para demektir.",
  },
  {
    id: 65,
    question: "'Liability' kelimesi ne anlama gelir?",
    options: ["Varlık", "Yükümlülük", "Kâr", "Gelir"],
    correctAnswer: 1,
    explanation: "Liability, yasal veya finansal sorumluluk anlamına gelir.",
  },

  // Academic - Advanced
  {
    id: 66,
    question: "'Empirical' kelimesinin Türkçe karşılığı nedir?",
    options: ["Teorik", "Deneysel, ampirik", "Hayali", "Soyut"],
    correctAnswer: 1,
    explanation: "Empirical, deneyim veya gözleme dayanan demektir.",
  },
  {
    id: 67,
    question: "'Theoretical' kelimesi ne anlama gelir?",
    options: ["Pratik", "Uygulamalı", "Gerçek", "Teorik, kuramsal"],
    correctAnswer: 3,
    explanation: "Theoretical, uygulamadan çok teori ile ilgili demektir.",
  },
  {
    id: 68,
    question: "'Analyze' kelimesinin Türkçe karşılığı nedir?",
    options: ["Analiz etmek", "Görmezden gelmek", "Karıştırmak", "Bozmak"],
    correctAnswer: 0,
    explanation: "Analyze, bir şeyi detaylı incelemek demektir.",
  },
  {
    id: 69,
    question: "'Synthesize' kelimesi ne anlama gelir?",
    options: ["Ayırmak", "Parçalamak", "Sentezlemek", "Silmek"],
    correctAnswer: 2,
    explanation: "Synthesize, farklı parçaları bir araya getirmek demektir.",
  },
  {
    id: 70,
    question: "'Methodology' kelimesinin Türkçe karşılığı nedir?",
    options: ["Mitoloji", "Meteoroloji", "Psikoloji", "Metodoloji"],
    correctAnswer: 3,
    explanation: "Methodology, araştırma yöntemlerinin sistematik çalışmasıdır.",
  },

  // Technology - Advanced
  {
    id: 71,
    question: "'Algorithm' kelimesi ne anlama gelir?",
    options: ["Algoritma", "Aritmetik", "Cebir", "Geometri"],
    correctAnswer: 0,
    explanation: "Algorithm, bir problemi çözmek için izlenen adımlar dizisidir.",
  },
  {
    id: 72,
    question: "'Encryption' kelimesinin Türkçe karşılığı nedir?",
    options: ["Silme", "Kopyalama", "Şifreleme", "Yapıştırma"],
    correctAnswer: 2,
    explanation: "Encryption, verileri güvenlik için şifreleme işlemidir.",
  },

  // Mixed difficulty
  {
    id: 73,
    question: "'Phenomenon' kelimesi ne anlama gelir?",
    options: ["Felaket", "Fenomen, olgu", "Festival", "Fantezi"],
    correctAnswer: 1,
    explanation: "Phenomenon, gözlemlenebilen bir olay veya olgudur.",
  },
  {
    id: 74,
    question: "'Nostalgic' kelimesinin Türkçe karşılığı nedir?",
    options: ["Korkak", "Endişeli", "Mutlu", "Nostaljik, özlem dolu"],
    correctAnswer: 3,
    explanation: "Nostalgic, geçmişe özlem duymak anlamına gelir.",
  },
  {
    id: 75,
    question: "'Atmosphere' kelimesi ne anlama gelir?",
    options: ["Atmosfer", "Astronot", "Astroloji", "Astronomi"],
    correctAnswer: 0,
    explanation: "Atmosphere, bir gezegeni saran gaz tabakasıdır.",
  },
];
