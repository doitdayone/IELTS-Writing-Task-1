/* ===== Shared helpers: sections, TTS, utils ===== */
window.VOCAB = [];

window.SECTIONS = [
  {n:1, icon:"✏️", cls:"c1", title:"Overview & Introduction", vn:"Mở bài & câu Overview"},
  {n:2, icon:"🔢", cls:"c2", title:"Key Expressions",         vn:"Diễn đạt số liệu"},
  {n:3, icon:"⚖️", cls:"c3", title:"Comparative & Superlative", vn:"Cấu trúc so sánh"},
  {n:4, icon:"📍", cls:"c4", title:"Body & Time Phrases",     vn:"Mở đoạn Body & mốc thời gian"},
  {n:5, icon:"📈", cls:"c5", title:"Trends",                  vn:"Động từ & trạng từ mô tả xu hướng"},
  {n:6, icon:"🔗", cls:"c6", title:"Grouping & Linking",      vn:"Từ nối & liên kết"}
];

/* ---------- Text-to-speech (Web Speech API) ---------- */
(function(){
  let voice = null;
  function pickVoice(){
    const vs = speechSynthesis.getVoices();
    if(!vs.length) return;
    voice =
      vs.find(v => /^en(-|_)(GB|US)/i.test(v.lang) && /natural|aria|jenny|libby|sonia|zira|hazel|guy|ryan/i.test(v.name)) ||
      vs.find(v => /^en(-|_)(GB|US)/i.test(v.lang)) ||
      vs.find(v => /^en/i.test(v.lang)) || null;
  }
  pickVoice();
  if (typeof speechSynthesis !== "undefined")
    speechSynthesis.onvoiceschanged = pickVoice;

  window.speak = function(text){
    if (typeof speechSynthesis === "undefined") return;
    speechSynthesis.cancel();
    const clean = String(text)
      .replace(/\*/g, "")
      .replace(/\s*\/\s*/g, ", ")
      .replace(/[…]/g, "")
      .replace(/\(.*?\)/g, "")
      .trim();
    const u = new SpeechSynthesisUtterance(clean);
    if (voice) u.voice = voice;
    u.lang = (voice && voice.lang) || "en-US";
    u.rate = 0.95;
    speechSynthesis.speak(u);
  };
})();

/* ---------- utils ---------- */
window.esc = function(s){
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
};
/* "*từ khoá*" trong câu -> <mark> để tô highlight */
window.renderSentence = function(s){
  return esc(s).replace(/\*(.+?)\*/g, "<mark>$1</mark>");
};
window.shuffle = function(arr){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
