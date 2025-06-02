// app.js

import { generateTest } from './ai-test-bot.js';
import { generatePoll } from './ai-poll-bot.js';
import { generateList } from './ai-list-bot.js';
import { generateNews } from './ai-news-bot.js';

window.runTestBot = async function () {
  const result = await generateTest();
  const el = document.getElementById('testList');
  if (el) {
    const li = document.createElement('li');
    li.textContent = result.title + " ✔️ Test eklendi";
    el.appendChild(li);
  }
};

window.runPollBot = async function () {
  const result = await generatePoll();
  const el = document.getElementById('pollList');
  if (el) {
    const li = document.createElement('li');
    li.textContent = result.question + " ✔️ Anket eklendi";
    el.appendChild(li);
  }
};

window.runListBot = async function () {
  const result = await generateList();
  const el = document.getElementById('listList');
  if (el) {
    const li = document.createElement('li');
    li.textContent = result.title + " ✔️ Liste eklendi";
    el.appendChild(li);
  }
};

window.runNewsBot = async function () {
  const result = await generateNews();
  const el = document.getElementById('newsList');
  if (el) {
    const li = document.createElement('li');
    li.textContent = result.title + " ✔️ Haber eklendi";
    el.appendChild(li);
  }
};
