
export async function generateTest() {
  const titles = [
    "Hangi Kahve Türü Senin Kişiliğini Yansıtıyor?",
    "Sosyal Medya Tarzına Göre Hangi Hayvansın?",
    "Hangi Oyun Karakteri Senin Ruh Halin?",
    "Gizli Gücünü Açığa Çıkaran Test",
    "Tek Bir Gününe Göre Hangi Dizide Yaşıyorsun?"
  ];

  const questions = [
    {
      text: "Sabah uyandığında ilk iş ne yaparsın?",
      options: ["Kahve içerim", "Sosyal medyaya bakarım", "Yürüyüşe çıkarım", "Yataktan çıkmam"],
      image: "https://source.unsplash.com/600x300/?morning,coffee"
    },
    {
      text: "Sana göre en iyi tatil türü nedir?",
      options: ["Macera", "Rahatlama", "Kültür gezisi", "Hiçbiri"],
      image: "https://source.unsplash.com/600x300/?vacation,adventure"
    },
    {
      text: "Telefon ekran süren ne kadar?",
      options: ["<2 saat", "2-4 saat", "5+ saat", "Bilmiyorum"],
      image: "https://source.unsplash.com/600x300/?smartphone,time"
    }
  ];

  const resultText = "Sen tam bir eğlence insanısın! Yeni şeyler keşfetmeye bayılıyorsun ve enerjinle etrafını aydınlatıyorsun.";
  const resultImage = "https://source.unsplash.com/600x300/?happy,people";

  const newTest = {
    title: titles[Math.floor(Math.random() * titles.length)],
    questions: questions,
    result: {
      text: resultText,
      image: resultImage
    },
    createdAt: new Date().toISOString()
  };

  const existing = JSON.parse(localStorage.getItem("tests") || "[]");
  existing.unshift(newTest);
  localStorage.setItem("tests", JSON.stringify(existing));

  return newTest;
}
