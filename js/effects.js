/* ===== ReactBits-inspired effects, vanilla JS =====
   BlurText, ClickSpark, TiltedCard, AnimatedContent (scroll reveal) */
window.FX = (function(){

  /* BlurText: chữ hiện dần từng ký tự với hiệu ứng blur */
  function blurText(el){
    if (!el) return;
    const text = el.textContent;
    el.textContent = "";
    [...text].forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "bt";
      s.style.transitionDelay = (i * 40) + "ms";
      s.textContent = ch === " " ? " " : ch;
      el.appendChild(s);
    });
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("bt-in")));
  }

  /* ClickSpark: pháo hoa nhỏ khi click */
  const SPARK_COLORS = ["#ff9ec3","#ffd166","#7fd8a5","#b3a5f2","#ffb076","#84bdf0"];
  document.addEventListener("pointerdown", e => {
    for (let i = 0; i < 10; i++){
      const p = document.createElement("span");
      p.className = "spark";
      const ang = Math.random() * Math.PI * 2;
      const dist = 26 + Math.random() * 42;
      p.style.left = e.clientX + "px";
      p.style.top  = e.clientY + "px";
      p.style.background = SPARK_COLORS[i % SPARK_COLORS.length];
      p.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      p.style.setProperty("--dy", Math.sin(ang) * dist + "px");
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 650);
    }
  });

  /* TiltedCard: nghiêng nhẹ theo chuột */
  function addTilt(el, max = 3){
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - .5) * -2 * max;
      const ry = ((e.clientX - r.left) / r.width - .5) *  2 * max;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  }

  /* AnimatedContent: hiện dần khi cuộn tới */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, {threshold:.06});

  return { blurText, addTilt, io };
})();
