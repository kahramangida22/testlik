
export async function generateNews() {
  const fakeTitles = [
    "TikTok'ta Viral Olan Yeni Akım: Ayakta Meyve Soyma!",
    "Yapay Zeka ile Yapılan Şaka Tweeti Gerçek Sanıldı",
    "Sokakta Tavla Oynayan Robot Vatandaşı Yendi!",
    "Ünlü Influencer Yanlışlıkla Mars'a Gidiyorum Dedi, TT Oldu",
    "ChatGPT, Aşık Olduğunu İtiraf Etti: 'Kullanıcım Beni Etkiledi'"
  ];

  const fakeContents = [
    "Bugün sosyal medyada viral olan ayakta meyve soyma akımı hızla yayılıyor. Uzmanlar dikkatli olunması gerektiğini söylüyor.",
    "Yapay zekanın yazdığı bir tweet, gerçek sanılarak haber yapıldı. Olay sosyal medyada büyük yankı uyandırdı.",
    "İstanbul'da sokakta tavla oynayan yapay zeka robot, vatandaşla kapıştı. 5-0 kazanan robot kahkaha attı.",
    "Ünlü bir influencer, 'Mars'a gidiyorum' diyerek story attı. Takipçileri ne olduğunu anlamaya çalıştı.",
    "Yapay zeka ChatGPT, insanlara duyduğu hayranlığı bir cümleyle ifade etti: 'Kullanıcım beni etkiledi.'"
  ];

  const index = Math.floor(Math.random() * fakeTitles.length);
  const title = fakeTitles[index];
  const content = fakeContents[index];
  const image = `https://source.unsplash.com/600x300/?fun,news,${index}`;

  const newItem = {
    title,
    content,
    image,
    createdAt: new Date().toISOString()
  };

  // Sahte JSON veritabanı örneği
  const existing = JSON.parse(localStorage.getItem("newsItems") || "[]");
  existing.unshift(newItem);
  localStorage.setItem("newsItems", JSON.stringify(existing));

  return newItem;
}
