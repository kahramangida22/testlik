
import { generateNews } from './ai-news-bot.js';

window.runNewsBot = async function () {
  const result = await generateNews();
  const newsList = document.getElementById('newsList');
  const li = document.createElement('li');
  li.textContent = result.title + " ✔️ eklendi";
  newsList.appendChild(li);
};
