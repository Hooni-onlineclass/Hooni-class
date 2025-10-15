
document.getElementById("registerBtn").addEventListener("click", async () => {
  const id = document.getElementById("userID").value.trim();
const pw = document.getElementById("userPW").value.trim();
const role = document.getElementById("roleSelect").value;
const name = document.getElementById("name").value.trim();
const phone = document.getElementById("phone").value.trim();
const email = document.getElementById("email").value.trim();

fetch("/api/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id, pw, role, name, phone, email })
})

  const data = await res.json();
  if (res.ok) {
    alert("회원가입 성공! 로그인 해주세요.");
    window.location.href = "/login.html";
  } else {
    alert(data.message);
  }
});
