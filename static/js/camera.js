// static/js/camera.js
let stream = null;
let videoEl = null;
let facingMode = "environment"; // 기본: 후면

export function getVideoElement() {
  if (!videoEl) {
    videoEl = document.createElement("video");
    videoEl.autoplay = true;
    videoEl.playsInline = true;
    videoEl.style.width = "100%";
    videoEl.style.aspectRatio = "4 / 3";
    videoEl.style.borderRadius = "16px";
  }
  return videoEl;
}

export async function startCamera() {
  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode, width: { ideal: 640 }, height: { ideal: 480 } },
    audio: false
  });
  videoEl.srcObject = stream;
  await videoEl.play();
  return videoEl;
}

export function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
}

export async function switchCamera() {
  facingMode = facingMode === "environment" ? "user" : "environment";
  stopCamera();
  return startCamera();
}