async function getTestData() {
  const urlParams = new URLSearchParams(window.location.search);
  const testId = parseInt(urlParams.get('id'));
  const res = await fetch('tests.json');
  const data = await res.json();
  return data.find(test => test.id === testId);
}

function createQuestionHTML(q, index) {
  let html = `<p>${index + 1}. ${q.q}</p>`;
  q.a.forEach((answer, i) => {
    html += `
      <label>
        <input type="radio" name="q${index}" value="${i}" required />
        ${answer}
      </label><br/>
    `;
  });
  return html;
}

async function loadTest() {
  const test = await getTestData();
  if (!test) {
    document.getElementById('test-title').textContent = "Test bulunamadı.";
    return;
  }

  document.getElementById('test-title').textContent = test.title;
  const container = document.getElementById('questions');
  container.innerHTML = "";
  test.questions.forEach((q, i) => {
    container.innerHTML += createQuestionHTML(q, i);
  });

  window.currentTest = test;
}

function submitTest() {
  const formElements = document.querySelectorAll('input[type="radio"]:checked');
  const total = window.currentTest.questions.length * window.currentTest.pointPerQuestion;
  const score = formElements.length * window.currentTest.pointPerQuestion;
  document.getElementById('result').innerHTML = `<h3>Puanın: ${score} / ${total}</h3>`;
}

window.onload = loadTest;
