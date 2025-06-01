
import { getFirestore, doc, updateDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { app } from './firebase.js';

const db = getFirestore(app);
const auth = getAuth(app);

export async function shareResult(resultText) {
  const platforms = ['Facebook', 'Instagram', 'TikTok', 'X', 'YouTube'];
  const user = auth.currentUser;
  if (!user) return alert('Giriş yapmalısın!');

  platforms.forEach(platform => {
    console.log(`Paylaşıldı: ${platform} - ${resultText}`);
  });

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  const currentScore = userSnap.data().score || 0;

  await updateDoc(userRef, {
    score: currentScore + 10  // Paylaşım başına +10 puan
  });

  alert('Paylaşım için +10 puan kazandın!');
}
