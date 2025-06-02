// ai-test-bot.js

import { db } from "./firebase.js";
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function generateTest() {
  const test = {
    title: "Hangi Kahve Türü Seni Yansıtıyor?",
    description: "Bu testte hangi kahve karakterine sahip olduğunu keşfet!",
    questions: [
      {
        question: "Sabah kalkınca ilk ne yaparsın?",
        options: ["Kahve içerim", "Yüzümü yıkarım", "Güne müzikle başlarım", "Spor yaparım"]
      },
      {
        question: "En sevdiğin tat?",
        options: ["Tatlı", "Ekşi", "Bitter", "Tuzlu"]
      },
      {
        question: "Hangi ortamda rahatlarsın?",
        options: ["Sessizlik", "Kafede", "Doğada", "Kalabalıkta"]
      },
      {
        question: "Hangi film türü?",
        options: ["Komedi", "Dram", "Aksiyon", "Bilim kurgu"]
      },
      {
        question: "Seni en iyi tanımlayan kelime?",
        options: ["Enerjik", "Dingin", "Meraklı", "Cool"]
      }
    ],
    results: [
      {
        title: "Espresso",
        description: "Yoğun ve net – tıpkı senin gibi!",
        image: "https://example.com/images/espresso.jpg"
      },
      {
        title: "Latte",
        description: "Yumuşak, sıcak, sevgi dolu!",
        image: "https://example.com/images/latte.jpg"
      },
      {
        title: "Cold Brew",
        description: "Soğukkanlı ve yenilikçi!",
        image: "https://example.com/images/coldbrew.jpg"
      }
    ],
    createdAt: Timestamp.now()
  };

  await addDoc(collection(db, "tests"), test);
  return test;
}
