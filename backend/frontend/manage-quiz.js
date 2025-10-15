
document.addEventListener("DOMContentLoaded", () => {
  const questionInput = document.getElementById("questionInput");
  const optionInputs = [
    document.getElementById("option1"),
    document.getElementById("option2"),
    document.getElementById("option3"),
    document.getElementById("option4")
  ];
  const answerSelect = document.getElementById("answerSelect");
  const quizList = document.getElementById("quizList");

  let editingId = null;

  async function fetchQuizzes() {
    try {
      const res = await fetch("https://hooni-class.onrender.com/api/quiz");
      const data = await res.json();
      renderQuizList(data);
    } catch (err) {
      console.error("퀴즈 불러오기 실패", err);
      quizList.innerHTML = "<p>퀴즈를 불러올 수 없습니다.</p>";
    }
  }

  function renderQuizList(quizzes) {
    quizList.innerHTML = "";
    if (quizzes.length === 0) {
      quizList.innerHTML = "<p>등록된 퀴즈가 없습니다.</p>";
      return;
    }

    quizzes.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "quiz-item";
      div.innerHTML = `
        <strong>문제 ${index + 1}:</strong> ${item.question}<br/>
        <ul>
          ${item.options.map((opt, i) => `<li>${i + 1}. ${opt}</li>`).join("")}
        </ul>
        <div>✅ 정답: ${item.options[item.answer]}</div>
        <div class="actions">
          <button class="edit" onclick="editQuiz('${item._id}')">수정</button>
          <button class="delete" onclick="deleteQuiz('${item._id}')">삭제</button>
        </div>
      `;
      quizList.appendChild(div);
    });
  }

  window.addQuiz = async function () {
    const question = questionInput.value.trim();
    const options = optionInputs.map(input => input.value.trim());
    const answer = parseInt(answerSelect.value);

    if (!question || options.some(opt => !opt) || isNaN(answer)) {
      alert("모든 항목을 입력하고 정답을 선택해주세요.");
      return;
    }

    const quizData = { question, options, answer };

    try {
      if (editingId) {
        await fetch(`https://hooni-class.onrender.com/api/quiz/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quizData)
        });
        editingId = null;
      } else {
        await fetch("https://hooni-class.onrender.com/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quizData)
        });
      }
      clearInputs();
      fetchQuizzes();
    } catch (err) {
      alert("등록 또는 수정 실패");
    }
  };

  window.deleteQuiz = async function (id) {
    if (!confirm("이 문제를 삭제하시겠습니까?")) return;
    try {
      await fetch(`https://hooni-class.onrender.com/api/quiz/${id}`, {
        method: "DELETE"
      });
      fetchQuizzes();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  window.editQuiz = async function (id) {
    try {
      const res = await fetch("https://hooni-class.onrender.com/api/quiz");
      const data = await res.json();
      const quiz = data.find(q => q._id === id);
      if (!quiz) return;

      questionInput.value = quiz.question;
      quiz.options.forEach((opt, i) => {
        optionInputs[i].value = opt;
      });
      answerSelect.value = quiz.answer;
      editingId = id;
    } catch (err) {
      alert("수정 불러오기 실패");
    }
  };

  function clearInputs() {
    questionInput.value = "";
    optionInputs.forEach(input => input.value = "");
    answerSelect.value = "";
    editingId = null;
  }

  fetchQuizzes();
});
