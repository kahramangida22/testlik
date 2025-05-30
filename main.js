// main.js
// Firebase Authentication, Firestore ve dil algılama ile ilgili ortak fonksiyonlar

// Dil algılama ve otomatik site dili ayarlama
function detectLanguage() {
  const userLang = navigator.language || navigator.userLanguage;
  if (userLang.startsWith('tr')) {
    document.documentElement.lang = 'tr';
  } else if (userLang.startsWith('en')) {
    document.documentElement.lang = 'en';
  } // Diğer diller eklenebilir
}
detectLanguage();

// Çıkış butonu fonksiyonu
document.addEventListener('DOMContentLoaded', function() {
  var logoutBtnElem = document.getElementById('logout-btn');
  if (logoutBtnElem) {
    logoutBtnElem.onclick = function(e) {
      e.preventDefault();
      firebase.auth().signOut().then(() => {
        window.location.href = "index.html";
      });
    }
  }
});

// Kullanıcı adıyla arama fonksiyonu (herhangi bir kullanıcı listesinde kullanabilirsin)
async function searchUserByUsername(username) {
  const q = await db.collection("users").where("username", "==", username).get();
  if (!q.empty) {
    let results = [];
    q.forEach(doc=>{ results.push({...doc.data(), uid:doc.id}); });
    return results;
  }
  return [];
}

// Arkadaş ekleme (istek gönderme) fonksiyonu
async function sendFriendRequest(targetUid) {
  const currentUid = firebase.auth().currentUser.uid;
  if (currentUid === targetUid) return false;
  // friendRequests: [{from:'uid',to:'uid',status:'pending/accepted'}]
  await db.collection("users").doc(targetUid).update({
    friendRequests: firebase.firestore.FieldValue.arrayUnion({
      from: currentUid,
      status: 'pending'
    })
  });
  alert('Arkadaşlık isteği gönderildi!');
}

// Arkadaşlık isteğini kabul et
async function acceptFriendRequest(fromUid) {
  const currentUid = firebase.auth().currentUser.uid;
  // Güncel kullanıcıda
  await db.collection("users").doc(currentUid).update({
    friends: firebase.firestore.FieldValue.arrayUnion(fromUid),
    friendRequests: firebase.firestore.FieldValue.arrayRemove({
      from: fromUid,
      status: 'pending'
    })
  });
  // Gönderen kullanıcıda
  await db.collection("users").doc(fromUid).update({
    friends: firebase.firestore.FieldValue.arrayUnion(currentUid)
  });
}

// Çözülen testleri kaydet (test-sonuc.html veya test-render.html sonunda çağır)
async function markTestAsSolved(testId) {
  const user = firebase.auth().currentUser;
  if (!user) return;
  await db.collection("users").doc(user.uid).update({
    completedTests: firebase.firestore.FieldValue.arrayUnion(testId)
  });
}

// Testi çözüp çözmediğini kontrol et
async function isTestSolved(testId) {
  const user = firebase.auth().currentUser;
  if (!user) return false;
  const doc = await db.collection("users").doc(user.uid).get();
  if (doc.exists && doc.data().completedTests && doc.data().completedTests.includes(testId)) {
    return true;
  }
  return false;
}

// Sosyal medya paylaşımı (örn: sonucu paylaş)
function shareOnSocial(platform, url, text) {
  let shareUrl = "";
  if (platform === "facebook") shareUrl = `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  if (platform === "twitter") shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  if (platform === "linkedin") shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
  window.open(shareUrl, "_blank");
}
