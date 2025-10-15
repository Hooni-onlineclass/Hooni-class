
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "https://hooni-class.onrender.com";
  const list = document.getElementById("materialsList");
  const subjectFilter = document.getElementById("subjectFilter");

  let allMaterials = [];

  async function fetchMaterials() {
    try {
      const res = await fetch(`${API_BASE}/api/materials`);
      const data = await res.json();
      allMaterials = data;
      renderMaterials();
    } catch (err) {
      console.error("자료 불러오기 실패", err);
      list.innerHTML = "<p>자료를 불러올 수 없습니다.</p>";
    }
  }

  async function deleteMaterial(id) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await fetch(`${API_BASE}/api/materials/${id}`, { method: "DELETE" });
      fetchMaterials();
    } catch (err) {
      alert("삭제 실패");
    }
  }

  function renderMaterials() {
    const filter = subjectFilter?.value || "전체";
    list.innerHTML = "";

    const filtered = filter === "전체"
      ? allMaterials
      : allMaterials.filter(m => m.subject === filter);

    if (filtered.length === 0) {
      list.innerHTML = "<p>등록된 자료가 없습니다.</p>";
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "material-card";
      card.innerHTML = `
        <div class="material-header">
          <span class="subject-tag ${item.subject}">${item.subject}</span>
          <strong>${item.title}</strong>
        </div>
        <div class="material-body">
          파일명: ${item.filename || "링크 자료"}
        </div>
        <div class="material-footer">
          <a href="${item.fileUrl}" target="_blank">
            <button>열기</button>
          </a>
          <button class="delete" onclick="deleteMaterial('${item._id}')">삭제</button>
        </div>
      `;
      list.appendChild(card);
    });
  }

  subjectFilter?.addEventListener("change", renderMaterials);

  fetchMaterials();
});
