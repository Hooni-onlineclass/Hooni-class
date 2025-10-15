
// ✅ 전역 변수로 회의창 추적
let jitsiWindow = null;

// ✅ 새 창 방식으로 회의방 띄우기 (중복 방지 + 포커스 유지)
window.openJitsiLikeFrame = function(roomLink) {
  const frame = document.getElementById("fake-frame");
  if (!frame) {
    console.error("❌ #fake-frame 요소를 찾을 수 없습니다.");
    return;
  }

  const rect = frame.getBoundingClientRect();
  const left = window.screenX + rect.left;
  const top = window.screenY + rect.top;
  const width = rect.width;
  const height = rect.height;

  const roomURL = roomLink.startsWith("https://") ? roomLink : `https://vc4all.de/${roomLink}`;

  // ✅ 이미 열려 있으면 포커스만 줌
  if (jitsiWindow && !jitsiWindow.closed) {
    jitsiWindow.focus();
    return;
  }

  // ✅ 새 창 열기
  jitsiWindow = window.open(
    roomURL,
    "jitsiWindow",
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,toolbar=no,menubar=no`
  );
};
