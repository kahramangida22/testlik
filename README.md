
# Testlik.com

Yapay zeka destekli test çözüm ve puan toplama sitesi.

## Özellikler
- Firebase ile kullanıcı girişi
- AI destekli test üretimi
- Lider tablosu ve puan sistemi
- Sosyal medya paylaşımı (bonus puanlı)

## Kurulum
1. ZIP dosyasını çıkartın.
2. Firebase API anahtarlarınızı `.env` veya `firebase.js` içinde güncelleyin.
3. Gerekirse sunucuya yükleyin veya Vercel/Netlify gibi bir yere deploy edin.

## Geliştirme
Tüm dosyalar `app.js`, `firebase.js`, `aiTestGenerator.js` ile modüler yapıda yazıldı.

## Haftalık Sıfırlama
`resetLeaderboard.js` dosyasını haftada bir cron olarak çalıştırın.
