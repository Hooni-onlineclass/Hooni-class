
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("materialForm");
  const list = document.getElementById("materialList");

  async function fetchMaterials() {
    try {
      const res = await fetch("/api/materials");
      const data = await res.json();
      renderMaterials(data);
    } catch (err) {
      console.error("자료 불러오기 실패", err);
      list.innerHTML = "<li>자료를 불러올 수 없습니다.</li>";
    }
  }

  function renderMaterials(materials) {
    list.innerHTML = "";
    if (materials.length === 0) {
      list.innerHTML = "<li>등록된 자료가 없습니다.</li>";
      return;
    }

    materials.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>[${item.subject}] ${item.title} (${item.filename || "링크"})</span>
        <div>
          <a href="${item.fileUrl}" target="_blank">
            <button>열기</button>
          </a>
          <button class="delete" onclick="deleteMaterial('${item._id}')">삭제</button>
        </div>
      `;
      list.appendChild(li);
    });
  }

  window.deleteMaterial = async function (id) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await fetch(`/api/materials/${id}`, { method: "DELETE" });
      fetchMaterials();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  form.addEventListener("submit", e => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const subject = document.getElementById("subject").value;
    const file = document.getElementById("file").files[0];

    if (!title || !subject || !file) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async function () {
      const newMaterial = {
        title,
        subject,
        filename: file.name,
        fileUrl: reader.result
      };

      try {
        await fetch("/api/materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMaterial)
        });
        form.reset();
        fetchMaterials();
      } catch (err) {
        alert("등록 실패");
      }
    };
    reader.readAsDataURL(file);
  });

  fetchMaterials();
});
