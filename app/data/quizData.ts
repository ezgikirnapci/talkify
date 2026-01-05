export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "'Persistence' kelimesi ne anlama gelir?",
    options: ["Azim, kararlılık", "Sabırsızlık", "Kayıtsızlık", "Tembellik"],
    correctAnswer: 0,
    explanation: "Persistence, zorluklara veya karşı koymalara rağmen bir şeyi yapmaya devam etmek anlamına gelir.",
  },
  {
    id: 2,
    question: "'Hello' kelimesinin doğru çevirisi hangisidir?",
    options: ["Güle güle", "Merhaba", "Teşekkürler", "Özür dilerim"],
    correctAnswer: 1,
    explanation: "'Hello' kelimesi Türkçe'de 'Merhaba' anlamına gelir.",
  },
  {
    id: 3,
    question: "'Kitap' kelimesinin İngilizce karşılığı nedir?",
    options: ["Book", "Table", "Chair", "Window"],
    correctAnswer: 0,
    explanation: "'Kitap' kelimesi İngilizce'de 'Book' anlamına gelir.",
  },
  {
    id: 4,
    question: "Hangi kelime 'Beautiful' anlamına gelir?",
    options: ["Çirkin", "Güzel", "Uzun", "Kısa"],
    correctAnswer: 1,
    explanation: "'Güzel' kelimesi İngilizce'de 'Beautiful' anlamına gelir.",
  },
  {
    id: 5,
    question: "'Courage' kelimesi ne anlama gelir?",
    options: ["Korku", "Cesaret", "Üzüntü", "Mutluluk"],
    correctAnswer: 1,
    explanation: "Courage, sizi korkutan bir şeyi yapabilme yeteneği anlamına gelir.",
  },
  {
    id: 6,
    question: "'Thank you' kelimesinin doğru çevirisi hangisidir?",
    options: ["Merhaba", "Teşekkürler", "Lütfen", "Özür dilerim"],
    correctAnswer: 1,
    explanation: "'Thank you' kelimesi Türkçe'de 'Teşekkürler' anlamına gelir.",
  },
  {
    id: 7,
    question: "'Su' kelimesinin İngilizce karşılığı nedir?",
    options: ["Fire", "Water", "Earth", "Air"],
    correctAnswer: 1,
    explanation: "'Su' kelimesi İngilizce'de 'Water' anlamına gelir.",
  },
  {
    id: 8,
    question: "Hangi kelime 'Happy' anlamına gelir?",
    options: ["Üzgün", "Mutlu", "Kızgın", "Yorgun"],
    correctAnswer: 1,
    explanation: "'Mutlu' kelimesi İngilizce'de 'Happy' anlamına gelir.",
  },
  {
    id: 9,
    question: "'Freedom' kelimesi ne anlama gelir?",
    options: ["Esaret", "Özgürlük", "Bağımlılık", "Kısıtlama"],
    correctAnswer: 1,
    explanation: "Freedom, istediği gibi hareket etme, konuşma veya düşünme gücü veya hakkı anlamına gelir.",
  },
  {
    id: 10,
    question: "'Goodbye' kelimesinin doğru çevirisi hangisidir?",
    options: ["Merhaba", "Güle güle", "Teşekkürler", "Lütfen"],
    correctAnswer: 1,
    explanation: "'Goodbye' kelimesi Türkçe'de 'Güle güle' anlamına gelir.",
  },
];

