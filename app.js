
import { generateTest } from './ai-test-bot.js';

window.runTestBot = async function () {
  const result = await generateTest();
  const testList = document.getElementById('testList');
  const li = document.createElement('li');
  li.textContent = result.title + " ✔️ eklendi";
  testList.appendChild(li);
};
