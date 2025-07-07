import { db } from "../firebase";
import {
  collection, doc, getDoc, getDocs, query, where, orderBy, limit, updateDoc, arrayUnion
} from "firebase/firestore";

// Trend (en beğenilen) testleri çek
export const getTrendingTests = async () => {
  const q = query(collection(db, "tests"), orderBy("likes", "desc"), limit(10));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Kategorileri çek
export const getCategories = async () => {
  const snap = await getDocs(collection(db, "categories"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Testi id ile çek
export const getTestById = async (id) => {
  const d = await getDoc(doc(db, "tests", id));
  return { id: d.id, ...d.data() };
};

// Kullanıcının çözmediği testleri öne çıkar
export const getAllTestsForUser = async (uid) => {
  const snap = await getDocs(collection(db, "tests"));
  return snap.docs.map(d => {
    const data = d.data();
    const isSolved = (data.answers || {})[uid] ? true : false;
    return { id: d.id, ...data, isSolved, isNew: !isSolved };
  }).sort((a, b) => a.isSolved - b.isSolved);
};

// Kullanıcının cevaplarını kaydet
export const saveUserAnswer = async (uid, testId, qIdx, optionIdx, isCorrect) => {
  const ref = doc(db, "tests", testId);
  await updateDoc(ref, {
    [`answers.${uid}.${qIdx}`]: { selected: optionIdx, isCorrect }
  });
};

// Beğeni ekle
export const likeTest = async (testId, uid) => {
  const ref = doc(db, "tests", testId);
  await updateDoc(ref, {
    likes: arrayUnion(uid)
  });
};

// Aynı kategoriden çözülmeyen bir sonraki testi bul
export const getNextUnsolvedTest = async (uid, categoryId, excludeIds = []) => {
  const q = query(
    collection(db, "tests"),
    where("category", "==", categoryId)
  );
  const snap = await getDocs(q);
  const unsolved = snap.docs
    .filter(d => !excludeIds.includes(d.id) && !(d.data().answers || {})[uid])
    .map(d => ({ id: d.id, ...d.data() }));
  return unsolved[0] || null;
};
