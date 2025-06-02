// ai-poll-bot.js

import { db } from "./firebase.js";
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function generatePoll() {
  const poll = {
    question: "Sence 2025'in en iyi dizisi hangisi?",
    options: ["The Last Kingdom", "Stranger Things", "Dark", "Succession"],
    votes: [0, 0, 0, 0],
    createdAt: Timestamp.now()
  };

  await addDoc(collection(db, "polls"), poll);
  return poll;
}
