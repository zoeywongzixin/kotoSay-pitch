/* ==========================================================================
   Count-up numbers
   An element with data-count shows its final value in the markup, so every
   slide is complete at rest. When its slide arrives, the number rolls up
   from zero to that value. Skipped under "Reduce motion".
   ========================================================================== */
(() => {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const ease = (t) => 1 - Math.pow(1 - t, 3);   // ease-out cubic
  const DURATION = 1100;

  function roll(el) {
    const target = parseFloat(el.dataset.count);
    if (!isFinite(target)) return;
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    const final = target.toFixed(decimals);
    if (reduce.matches) { el.textContent = final; return; }
    const delay = 180;
    const start = performance.now() + delay;
    cancelAnimationFrame(el._roll || 0);
    const step = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / DURATION));
      el.textContent = (target * ease(t)).toFixed(decimals);
      if (t < 1) el._roll = requestAnimationFrame(step);
      else el.textContent = final;
    };
    el._roll = requestAnimationFrame(step);
  }

  document.querySelectorAll(".slide").forEach((slide) => {
    const nums = slide.querySelectorAll("[data-count]");
    if (!nums.length) return;
    let was = slide.classList.contains("is-visible");
    new MutationObserver(() => {
      const now = slide.classList.contains("is-visible");
      if (now && !was) nums.forEach(roll);
      was = now;
    }).observe(slide, { attributes: true, attributeFilter: ["class"] });
  });
})();
