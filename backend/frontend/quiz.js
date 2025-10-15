
let questions = [];
let currentIndex = 0;
let score = 0;

const API_BASE = "https://hooni-class.onrender.com";

// ✅ 퀴즈 문제 서버에서 불러오기
async function loadQuizFromServer() {
  try {
    const res = await fetch(`${API_BASE}/api/quiz`);
    const data = await res.json();
    if (data.length === 0) {
      alert("등록된 퀴즈가 없습니다. 관리자에게 문의하세요.");
      return [];
    }
    return data.sort(() => Math.random() - 0.5); // 랜덤 섞기
  } catch (err) {
    alert("퀴즈를 불러오는 중 오류가 발생했습니다.");
    return [];
  }
}

// ✅ 퀴즈 시작
async function startQuiz() {
  questions = await loadQuizFromServer();
  currentIndex = 0;
  score = 0;
  renderQuestion();
}

// ✅ 문제 렌더링
function renderQuestion() {
  const container = document.getElementById("quizContainer");
  container.innerHTML = "";

  if (currentIndex >= questions.length) {
    saveResult(); // 퀴즈 끝나면 결과 저장
    container.innerHTML = `<div class="question">🎉 퀴즈 완료! 수고했어요!<br/>총점: ${score} / ${questions.length}</div>`;
    return;
  }

  const item = questions[currentIndex];
  const div = document.createElement("div");
  div.innerHTML = `
    <div class="question">${item.question}</div>
    ${item.options.map((opt, i) => `
      <div>
        <label>
          <input type="radio" name="userAnswer" value="${i}" />
          ${opt}
        </label>
      </div>
    `).join("")}
    <button class="submit" onclick="checkAnswer()">제출</button>
    <div class="feedback" id="feedbackBox"></div>
    <div class="counter" id="counterBox"></div>
  `;
  container.appendChild(div);
}

// ✅ 정답 체크
function checkAnswer() {
  const selected = document.querySelector('input[name="userAnswer"]:checked');
  const feedback = document.getElementById("feedbackBox");
  const counterBox = document.getElementById("counterBox");

  if (!selected) {
    alert("답을 선택해주세요.");
    return;
  }

  const userAnswer = parseInt(selected.value);
  const correctAnswer = questions[currentIndex].answer;

  if (userAnswer === correctAnswer) {
    score++;
    feedback.innerHTML = `✅ 정답입니다!<br/><img src="https://cdn-icons-png.flaticon.com/512/2278/2278992.png" alt="박수" />`;
  } else {
    feedback.innerHTML = `❌ 오답입니다!<br/><img src="https://cdn-icons-png.flaticon.com/512/742/742751.png" alt="실망" />`;
  }

  let timeLeft = 5;
  counterBox.textContent = `⏳ ${timeLeft}초 후 다음 문제로 이동합니다`;

  const timer = setInterval(() => {
    timeLeft--;
    counterBox.textContent = `⏳ ${timeLeft}초 후 다음 문제로 이동합니다`;
    if (timeLeft === 0) {
      clearInterval(timer);
      currentIndex++;
      renderQuestion();
    }
  }, 1000);
}

// ✅ 퀴즈 결과 저장 (localStorage + 서버)
function saveResult() {
  const username = localStorage.getItem("username") || "익명";
  const today = new Date().toISOString().split("T")[0];
  const result = {
    name: username,
    score: score,
    total: questions.length,
    date: today
  };

  // localStorage 저장
  const results = JSON.parse(localStorage.getItem("quizResults") || "[]");
  results.push(result);
  localStorage.setItem("quizResults", JSON.stringify(results));

  // 서버 저장
  fetch(`${API_BASE}/api/quiz-result`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result)
  })
  .then(res => {
    if (!res.ok) throw new Error("서버 저장 실패");
    console.log("✅ 서버에 결과 저장 완료");
  })
  .catch(err => {
    console.error("❌ 서버 저장 오류:", err);
  });
}

// ✅ 실시간 퀴즈 안내 영역
function showLiveQuizPlaceholder() {
  const container = document.getElementById("quizContainer");
  container.innerHTML = `
    <div class="placeholder">
      ⚡ <strong>실시간 퀴즈 영역입니다</strong><br/><br/>
      아래 QR코드를 스캔하거나 링크를 클릭하면 실시간 퀴즈에 참여할 수 있어요.<br/><br/>

      <a href="https://heroic-cuchufli-a779ce.netlify.app/robotics_quiz1_student.html" target="_blank">
        <img src="images/15.png" alt="실시간 퀴즈 QR코드" style="width:200px;" />
      </a><br/>

      <p>
        👉 <a href="https://heroic-cuchufli-a779ce.netlify.app/robotics_quiz1_student.html" target="_blank">
          https://heroic-cuchufli-a779ce.netlify.app/robotics_quiz1_student.html
        </a>
      </p>

      <small>QR코드를 스캔하거나 이미지를 클릭하면 실시간 퀴즈로 이동합니다.</small>
    </div>
  `;
}
