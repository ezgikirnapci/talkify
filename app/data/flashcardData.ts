export interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
  example?: string;
}

export const flashcards: Flashcard[] = [
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
    front: "Freedom",
    back: "Özgürlük",
    category: "Abstract",
    example: "Özgürlük temel bir insan hakkıdır.",
  },
  {
    id: 4,
    front: "Beautiful",
    back: "Güzel",
    category: "Adjective",
    example: "Onun güzel bir gülümsemesi var.",
  },
  {
    id: 5,
    front: "Happy",
    back: "Mutlu",
    category: "Emotion",
    example: "Seni gördüğüm için mutluyum.",
  },
  {
    id: 6,
    front: "Water",
    back: "Su",
    category: "Nature",
    example: "Lütfen bana bir bardak su getir.",
  },
  {
    id: 7,
    front: "Book",
    back: "Kitap",
    category: "Object",
    example: "Kitap okumayı seviyorum.",
  },
  {
    id: 8,
    front: "Hello",
    back: "Merhaba",
    category: "Greeting",
    example: "Merhaba, nasılsın?",
  },
  {
    id: 9,
    front: "Thank you",
    back: "Teşekkürler",
    category: "Greeting",
    example: "Yardımın için teşekkürler.",
  },
  {
    id: 10,
    front: "Goodbye",
    back: "Güle güle",
    category: "Greeting",
    example: "Hoşça kal, yarın görüşürüz!",
  },
  {
    id: 11,
    front: "Wisdom",
    back: "Bilgelik",
    category: "Abstract",
    example: "Bilgelik deneyimle gelir.",
  },
  {
    id: 12,
    front: "Hope",
    back: "Umut",
    category: "Emotion",
    example: "Umudunu asla kaybetme.",
  },
];





