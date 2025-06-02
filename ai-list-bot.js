// ai-list-bot.js

import { db } from "./firebase.js";
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function generateList() {
  const list = {
    title: "Yazın Denemen Gereken 5 Serinletici İçecek",
    items: [
      "Soğuk Türk Kahvesi",
      "Ev yapımı Limonata",
      "Buzlu Matcha Latte",
      "Meyveli Smoothie",
      "Soğuk Hibiskus Çayı"
    ],
    createdAt: Timestamp.now()
  };

  await addDoc(collection(db, "lists"), list);
  return list;
}
