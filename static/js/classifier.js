// static/js/classifier.js
let model = null;
let timer = null;

const GUIDE = {
  과자봉지: ['내용물 비우고 이물질 제거', '비닐류 수거함'],
  캔: ['헹구기', '찌그러뜨리기', '캔 전용'],
  페트: ['라벨 제거', '압축', '투명 페트'],
  unknown: ['가까이 비춰주세요']
};

export async function loadModel(base) {
  if (!model) {
    model = await tmImage.load(base + "model.json", base + "metadata.json");
  }
}

export function startInfer(video, onUpdate) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  timer = setInterval(async () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const preds = await model.predict(canvas);
    if (!preds?.length) return;

    preds.sort((a,b)=>b.probability-a.probability);
    const best = preds[0];

    onUpdate(best.className || "unknown", best.probability || 0, GUIDE);
  }, 300);
}

export function stopInfer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}