// ai-news-bot.js

import { db } from "./firebase.js";
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function generateNews() {
  const news = {
    title: "Yapay Zeka ile Hazırlanan 2025 Yaz Trendleri Açıklandı!",
    summary: "Giyimde pembe tonları, teknolojide giyilebilir yapay zekalar öne çıkıyor.",
    content: `
      2025 yazında dünya genelinde dikkat çeken trendler arasında
      pembe ve turuncu tonlarıyla tasarlanan giysiler, giyilebilir yapay zeka destekli saatler ve
      artırılmış gerçeklik gözlükleri öne çıkıyor. Özellikle sosyal medyada AI influencer'ların etkisi
      büyük oldu. Türkiye'den çıkan AI modacılar da globalde ses getirdi.`,
    image: "https://example.com/images/ai-fashion-2025.jpg",
    date: new Date().toLocaleDateString("tr-TR"),
    createdAt: Timestamp.now()
  };

  await addDoc(collection(db, "news"), news);
  return news;
}
