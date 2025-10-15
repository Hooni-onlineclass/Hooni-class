
document.getElementById("registerBtn").addEventListener("click", async () => {
  const API_BASE = "https://hooni-class.onrender.com";

  const id = document.getElementById("userID").value.trim();
  const pw = document.getElementById("userPW").value.trim();
  const role = document.getElementById("roleSelect").value;
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!id || !pw || !role || !name || !phone || !email) {
    alert("모든 항목을 입력해주세요!");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, pw, role, name, phone, email })
    });

    const data = await res.json();

    if (res.ok) {
      alert("회원가입 성공! 로그인 해주세요.");
      window.location.href = "/login.html"; // ✅ 로그인 페이지로 이동
    } else {
      alert(data.message || "회원가입 실패");
    }
  } catch (err) {
    alert("서버 오류로 가입할 수 없습니다.");
    console.error("회원가입 오류:", err);
  }
});
