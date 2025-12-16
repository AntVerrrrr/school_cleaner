import { getVideoElement, startCamera, stopCamera, switchCamera } from "./camera.js";
import { loadModel, startInfer, stopInfer } from "./classifier.js";

const btnCam = document.getElementById("btnCam");
const btnSwitch = document.getElementById("btnSwitch");
const wrap = document.getElementById("webcam-container");
const placeholder = document.getElementById("camera-placeholder");

let running = false;

btnCam.onclick = async () => {
  if (!running) {
    await loadModel(window.TM_MODEL_BASE);

    const video = getVideoElement();
    wrap.innerHTML = "";
    wrap.appendChild(video);

    await startCamera();

    placeholder.style.display = "none";
    btnSwitch.disabled = false;

    startInfer(video, (label, prob, GUIDE) => {
      document.getElementById("result").textContent = `${label} (${(prob*100).toFixed(1)}%)`;
      document.getElementById("guide").innerHTML = "• " + (GUIDE[label] || GUIDE.unknown).join("<br>• ");
    });

    btnCam.textContent = "카메라 끄기";
    running = true;
  } else {
    stopInfer();
    stopCamera();
    wrap.innerHTML = "";
    placeholder.style.display = "flex";
    btnSwitch.disabled = true;

    btnCam.textContent = "카메라 켜기";
    running = false;
  }
};

btnSwitch.onclick = async () => {
  if (!running) return;
  const video = await switchCamera();
  wrap.innerHTML = "";
  wrap.appendChild(video);
};








//// static/js/app.js
//const btn = document.getElementById('btnCam');
//const videoEl = document.createElement('video');
//const webcamWrap = document.getElementById('webcam-container');
//const resultEl = document.getElementById('result');
//const guideEl  = document.getElementById('guide');
//
//let model = null;
//let running = false;
//let stream = null;
//let inferTimer = null;
//
//const GUIDE = {
//  '과자봉지': ['내용물 비우고 이물질 제거', '물기 제거 후 비닐류 수거함'],
//  '캔': ['내용물 비우고 헹구기', '가능하면 찌그러뜨려 부피 줄이기', '금속캔 전용 배출함'],
//  '페트': ['내용물 비우고 헹구기', '라벨·뚜껑 분리', '압축 후 투명 페트 전용'],
//  'unknown': ['조명 밝게 / 더 가까이', '로고·모양이 보이도록 정면으로']
//};
//
//async function initModel() {
//  if (!model) {
//    const base = window.TM_MODEL_BASE || '/static/model/';
//    model = await tmImage.load(base + 'model.json', base + 'metadata.json');
//    console.log('Model loaded ✅');
//  }
//}
//
//async function startCamera() {
//  const placeholder = document.getElementById('camera-placeholder');
//  const camWrap = document.querySelector('.cam-wrap');
//
//  // 1️⃣ 카메라 스트림 요청
//  stream = await navigator.mediaDevices.getUserMedia({
//    video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
//    audio: false,
//  });
//  videoEl.srcObject = stream;
//  videoEl.autoplay = true;
//  videoEl.playsInline = true;
//  videoEl.style.width = '100%';
//  videoEl.style.height = 'auto';
//  videoEl.style.aspectRatio = '4 / 3';
//  videoEl.style.display = 'block';
//  videoEl.style.borderRadius = '16px';
//  webcamWrap.innerHTML = '';
//  webcamWrap.appendChild(videoEl);
//
//  // placeholder는 감춤
//  placeholder.style.display = 'none';
//
//  // 2️⃣ 비디오가 로드될 때까지 기다림
//  await new Promise((res) => {
//    videoEl.onloadedmetadata = () => res();
//  });
//
//  running = true;
//  startInferLoop(videoEl);
//}
//
//async function startInferLoop(video) {
//  if (inferTimer) clearInterval(inferTimer);
//
//  const canvas = document.createElement('canvas');
//  const ctx = canvas.getContext('2d');
//
//  inferTimer = setInterval(async () => {
//    if (!running || !model) return;
//
//    // 캔버스 크기를 비디오에 맞춤
//    canvas.width = video.videoWidth;
//    canvas.height = video.videoHeight;
//    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//
//    const preds = await model.predict(canvas);
//    if (!Array.isArray(preds) || preds.length === 0) return;
//
//    preds.sort((a, b) => b.probability - a.probability);
//    const best = preds[0];
//    const label = best.className || 'unknown';
//    const prob  = best.probability || 0;
//
//    resultEl.textContent = `${label} (${(prob*100).toFixed(1)}%)`;
//
//    const steps = GUIDE[label] || GUIDE['unknown'];
//    guideEl.innerHTML = '• ' + steps.join('<br>• ');
//  }, 300);
//}
//
//function stopCamera() {
//  running = false;
//  if (inferTimer) clearInterval(inferTimer);
//  if (stream) {
//    stream.getTracks().forEach((t) => t.stop());
//    stream = null;
//  }
//  webcamWrap.innerHTML = '';
//  document.getElementById('camera-placeholder').style.display = 'block';
//  resultEl.textContent = '';
//  guideEl.textContent = '';
//}
//
//btn.addEventListener('click', async () => {
//  if (!running) {
//    btn.disabled = true;
//    try {
//      await initModel();
//      await startCamera();
//      btn.textContent = '카메라 끄기';
//    } catch (e) {
//      console.error(e);
//      alert('카메라/모델 초기화 실패: ' + e.message);
//      stopCamera();
//    } finally {
//      btn.disabled = false;
//    }
//  } else {
//    stopCamera();
//    btn.textContent = '카메라 켜기';
//  }
//});