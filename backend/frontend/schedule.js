
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "https://hooni-class.onrender.com";
  const isAdmin = location.pathname.includes("manage-schedule");
  const form = document.getElementById("scheduleForm");
  const list = document.getElementById("scheduleList");
  const calendarEl = document.getElementById("calendar");

  const currentUser = "후니"; // 사용자 이름 고정

  async function loadSchedule() {
    try {
      const res = await fetch(`${API_BASE}/api/schedule?user=${encodeURIComponent(currentUser)}`);
      return await res.json();
    } catch (err) {
      console.error("일정 불러오기 실패:", err);
      return [];
    }
  }

  async function saveSchedule(data) {
    try {
      const res = await fetch(`${API_BASE}/api/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (err) {
      console.error("일정 저장 실패:", err);
    }
  }

  async function deleteSchedule(id) {
    try {
      await fetch(`${API_BASE}/api/schedule/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  }

  async function renderScheduleList() {
    const schedules = await loadSchedule();
    list.innerHTML = "";

    if (schedules.length === 0) {
      list.innerHTML = "<li>등록된 일정이 없습니다.</li>";
      return;
    }

    schedules.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.title} - ${new Date(item.start).toLocaleString()} ${item.url ? `(<a href="${item.url}" target="_blank">링크</a>)` : ""}</span>
        <button class="delete" onclick="handleDelete('${item._id}')">삭제</button>
      `;
      list.appendChild(li);
    });
  }

  async function renderCalendar() {
    const schedules = await loadSchedule();
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'ko',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: schedules,
      eventClick: function(info) {
        const link = info.event.url;
        if (!link) {
          alert("❌ 회의 링크가 없습니다.");
          return;
        }

        if (typeof openJitsiLikeFrame === "function") {
          openJitsiLikeFrame(link);
        } else {
          window.open(link, "_blank", "width=1200,height=750,left=80,top=80");
        }

        info.jsEvent.preventDefault(); // 기본 링크 동작 막기
      }
    });
    calendar.render();
  }

  window.handleDelete = async function (id) {
    if (confirm("일정을 삭제하시겠습니까?")) {
      await deleteSchedule(id);
      if (list) renderScheduleList();
      if (calendarEl) renderCalendar();
    }
  };

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const datetime = document.getElementById("datetime").value;
    const link = document.getElementById("link").value.trim();

    if (!title || !datetime) {
      alert("제목과 날짜를 입력해주세요.");
      return;
    }

    const newSchedule = {
      title,
      start: datetime,
      url: link || "",
      user: currentUser
    };

    await saveSchedule(newSchedule);
    renderScheduleList();
    if (calendarEl) renderCalendar();
    form.reset();
  });

  if (list) renderScheduleList();
  if (calendarEl) renderCalendar();
});

// ✅ 수업 목록 불러오기
async function loadVideoClasses() {
  const API_BASE = "https://hooni-class.onrender.com";
  try {
    const res = await fetch(`${API_BASE}/api/video-class?createdBy=후니`);
    const classes = await res.json();

    const select = document.getElementById("classSelector");
    if (!select) return;

    classes.forEach(cls => {
      const option = document.createElement("option");
      option.value = cls._id;
      option.textContent = `${cls.title} (${new Date(cls.datetime).toLocaleDateString()})`;
      select.appendChild(option);
    });

    select.addEventListener("change", () => {
      const selectedId = select.value;
      if (selectedId) fillScheduleFields(selectedId);
    });
  } catch (err) {
    console.error("수업 목록 불러오기 실패:", err);
  }
}

// ✅ 선택된 수업 정보 자동 채우기
async function fillScheduleFields(classId) {
  const API_BASE = "https://hooni-class.onrender.com";
  try {
    const res = await fetch(`${API_BASE}/api/video-class/${classId}`);
    const cls = await res.json();

    document.getElementById("title").value = cls.title;
    document.getElementById("datetime").value = cls.datetime.slice(0, 16);
    document.getElementById("link").value = cls.link || "";
  } catch (err) {
    console.error("수업 정보 불러오기 실패:", err);
  }
}

// ✅ 페이지 로딩 시 수업 목록 불러오기
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("classSelector")) {
    loadVideoClasses();
  }
});
