/* ===== Trang sổ tay chính: render 6 phần + popup 10 câu ví dụ ===== */
(function(){
  const board = document.getElementById("board");
  const toc   = document.getElementById("toc");

  /* gom từ theo phần */
  const bySec = {};
  VOCAB.forEach(v => { (bySec[v.sec] = bySec[v.sec] || []).push(v); });

  SECTIONS.forEach(sec => {
    const items = bySec[sec.n] || [];

    /* pill mục lục */
    const a = document.createElement("a");
    a.href = "#sec-" + sec.n;
    a.textContent = sec.icon + " " + sec.title;
    toc.appendChild(a);

    /* thẻ sticky note của phần */
    const card = document.createElement("section");
    card.className = "card " + sec.cls;
    card.id = "sec-" + sec.n;
    card.innerHTML =
      `<div class="tape" aria-hidden="true"></div>
       <h2><span class="icon">${sec.icon}</span> ${esc(sec.title)}
           <span class="count-badge">${items.length} từ</span></h2>
       <p class="sec-vn">${esc(sec.vn)}</p>`;

    /* nhóm theo tiểu mục (giữ thứ tự xuất hiện) */
    const subOrder = [];
    const subMap = {};
    items.forEach(v => {
      const k = v.sub || "";
      if (!(k in subMap)){ subMap[k] = []; subOrder.push(k); }
      subMap[k].push(v);
    });

    subOrder.forEach(name => {
      if (name){
        const h = document.createElement("h3");
        h.textContent = name;
        card.appendChild(h);
      }
      const wrap = document.createElement("div");
      wrap.className = "chips";
      subMap[name].forEach(v => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip";
        chip.innerHTML =
          `<span class="w">${esc(v.w)}</span><span class="vn">${esc(v.vn)}</span>`;
        const spk = document.createElement("span");
        spk.className = "spk";
        spk.textContent = "🔊";
        spk.title = "Nghe phát âm";
        spk.addEventListener("click", e => { e.stopPropagation(); speak(v.w); });
        chip.appendChild(spk);
        chip.addEventListener("click", () => openPopup(v, sec));
        wrap.appendChild(chip);
      });
      card.appendChild(wrap);
    });

    board.appendChild(card);
    FX.io.observe(card);
    FX.addTilt(card, 1.6);
  });

  /* ---------- popup ---------- */
  const overlay  = document.getElementById("overlay");
  const popWord  = document.getElementById("popWord");
  const popVn    = document.getElementById("popVn");
  const popTag   = document.getElementById("popTag");
  const popList  = document.getElementById("popList");
  const popSpeak = document.getElementById("popSpeak");
  const popClose = document.getElementById("popClose");
  let currentWord = "";

  function openPopup(v, sec){
    currentWord = v.w;
    popWord.textContent = v.w;
    popVn.textContent   = v.vn;
    popTag.textContent  = sec.icon + " " + sec.title + (v.sub ? " · " + v.sub : "");
    popList.innerHTML   = "";
    v.s.forEach(sent => {
      const li  = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "spk-s";
      btn.textContent = "🔊";
      btn.title = "Nghe câu này";
      btn.addEventListener("click", () => speak(sent));
      const span = document.createElement("span");
      span.innerHTML = renderSentence(sent);
      li.appendChild(btn);
      li.appendChild(span);
      popList.appendChild(li);
    });
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closePopup(){
    overlay.hidden = true;
    document.body.style.overflow = "";
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
  }
  popSpeak.addEventListener("click", () => speak(currentWord));
  popClose.addEventListener("click", closePopup);
  overlay.addEventListener("click", e => { if (e.target === overlay) closePopup(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !overlay.hidden) closePopup();
  });

  /* hero title effect */
  FX.blurText(document.getElementById("heroTitle"));
})();
