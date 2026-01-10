/* ==================== BACKGROUND STAR FIELD ==================== */

export function initBackground() {
  const starContainer = document.getElementById("starContainer");
  if (!starContainer) return;

  const stars = [];
  const numStars = 200;

  // Create Stars
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    // Random positioning
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;

    // Random delay for twinkling
    star.style.setProperty("--delay", `${Math.random() * 2}s`);

    starContainer.appendChild(star);

    stars.push({
      el: star,
      baseX: parseFloat(star.style.left),
      baseY: parseFloat(star.style.top),
      speedX: (Math.random() - 0.5) * 0.5, // Magnetic parallax factor
      speedY: (Math.random() - 0.5) * 0.8,
    });
  }

  // Magnetic scroll effect
  let scrollY = 0;
  window.addEventListener(
    "scroll",
    () => {
      scrollY = window.scrollY;
    },
    { passive: true }
  );

  function updateStars() {
    stars.forEach((star) => {
      const offsetX = scrollY * star.speedX;
      const offsetY = scrollY * star.speedY;
      star.el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
    requestAnimationFrame(updateStars);
  }

  requestAnimationFrame(updateStars);
  console.log("✨ Background stars initialized");
}
