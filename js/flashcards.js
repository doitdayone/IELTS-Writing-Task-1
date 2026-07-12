/* ===== Trang flashcards: chọn phần -> lật thẻ -> kết quả ===== */
(function(){
  const $ = id => document.getElementById(id);
  const setup = $("setup"), study = $("study"), result = $("result");
  const secPicker = $("secPicker"), setupCount = $("setupCount");
  const card = $("card"), fcWord = $("fcWord"), fcVn = $("fcVn"), fcExample = $("fcExample");
  const progressFill = $("progressFill"), progressText = $("progressText");

  /* ---- màn hình chọn phần ---- */
  const counts = {};
  VOCAB.forEach(v => { counts[v.sec] = (counts[v.sec] || 0) + 1; });

  SECTIONS.forEach(sec => {
    const label = document.createElement("label");
    label.className = "sec-pick";
    label.innerHTML =
      `<input type="checkbox" value="${sec.n}" checked>
       <span>${sec.icon} ${esc(sec.title)} <span class="n">(${counts[sec.n] || 0} từ)</span></span>`;
    secPicker.appendChild(label);
  });

  function checkedSecs(){
    return [...secPicker.querySelectorAll("input:checked")].map(i => Number(i.value));
  }
  function updateCount(){
    const secs = checkedSecs();
    const n = VOCAB.filter(v => secs.includes(v.sec)).length;
    setupCount.textContent = n ? `🃏 Bộ thẻ của bạn: ${n} từ` : "⚠️ Hãy chọn ít nhất 1 phần nhé!";
  }
  secPicker.addEventListener("change", updateCount);
  updateCount();

  /* ---- trạng thái học ---- */
  let deck = [], fullDeck = [], idx = 0, knownCount = 0, unknown = [];

  function show(el){ [setup, study, result].forEach(s => s.hidden = (s !== el)); }

  function startDeck(cards){
    deck = $("optShuffle").checked ? shuffle(cards) : cards.slice();
    idx = 0; knownCount = 0; unknown = [];
    show(study);
    renderCard();
  }

  $("btnStart").addEventListener("click", () => {
    const secs = checkedSecs();
    const cards = VOCAB.filter(v => secs.includes(v.sec));
    if (!cards.length){ updateCount(); return; }
    fullDeck = cards;
    startDeck(cards);
  });

  function renderCard(){
    const v = deck[idx];
    const wasFlipped = card.classList.contains("flipped");
    card.classList.remove("flipped");
    const apply = () => {
      fcWord.textContent = v.w;
      fcVn.textContent = v.vn;
      fcExample.innerHTML = "✏️ " + renderSentence(v.s[0]);
    };
    /* nếu thẻ đang lật thì đợi úp lại mới thay chữ, tránh lộ đáp án thẻ mới */
    if (wasFlipped) setTimeout(apply, 280); else apply();
    progressFill.style.width = (idx / deck.length * 100) + "%";
    progressText.textContent = `Thẻ ${idx + 1} / ${deck.length} · ✅ ${knownCount} · ❌ ${unknown.length}`;
    if ($("optAutoSpeak").checked) speak(v.w);
  }

  function next(known){
    const v = deck[idx];
    if (known) knownCount++; else unknown.push(v);
    idx++;
    if (idx >= deck.length){ finish(); } else { renderCard(); }
  }

  function finish(){
    progressFill.style.width = "100%";
    show(result);
    const total = deck.length;
    $("resultText").innerHTML =
      `Bạn đã ôn xong <b>${total}</b> thẻ!<br>` +
      `✅ Đã thuộc: <b>${knownCount}</b> &nbsp;·&nbsp; ❌ Chưa thuộc: <b>${unknown.length}</b>` +
      (unknown.length === 0 ? "<br>🌟 Tuyệt vời, thuộc hết rồi!" : "");
    $("btnReviewUnknown").hidden = unknown.length === 0;
  }

  /* ---- điều khiển ---- */
  card.addEventListener("click", () => card.classList.toggle("flipped"));
  $("fcSpeakFront").addEventListener("click", e => { e.stopPropagation(); speak(deck[idx].w); });
  $("fcSpeakBack").addEventListener("click",  e => { e.stopPropagation(); speak(deck[idx].s[0]); });
  $("btnAgain").addEventListener("click", () => next(false));
  $("btnGot").addEventListener("click", () => next(true));
  $("btnQuit").addEventListener("click", () => show(setup));
  $("btnReviewUnknown").addEventListener("click", () => startDeck(unknown));
  $("btnRestart").addEventListener("click", () => startDeck(fullDeck));
  $("btnBackSetup").addEventListener("click", () => show(setup));

  document.addEventListener("keydown", e => {
    if (study.hidden) return;
    if (e.code === "Space"){ e.preventDefault(); card.classList.toggle("flipped"); }
    else if (e.key === "ArrowLeft")  next(false);
    else if (e.key === "ArrowRight") next(true);
    else if (e.key.toLowerCase() === "s") speak(deck[idx].w);
  });

  FX.blurText(document.getElementById("heroTitle"));
  FX.addTilt(card, 2.5);
})();
