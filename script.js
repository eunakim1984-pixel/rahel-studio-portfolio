const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const supportsScrollTimeline = CSS.supports("animation-timeline: view()");

const padPage = (page) => String(page).padStart(2, "0");

function buildProjectPreview(project) {
  const slug = project.dataset.project;
  const pageCount = Number(project.dataset.pages);
  const title = project.dataset.title;
  const screen = project.querySelector(".device-screen");
  const track = project.querySelector(".screen-track");
  const error = project.querySelector(".device-error");
  let fallbackAnimation;
  let isPausedByUser = false;
  let hasLoaded = false;

  const setDistance = () => {
    const distance = Math.max(0, track.scrollHeight - screen.clientHeight);
    track.style.setProperty("--scroll-distance", `${-distance}px`);
    track.classList.add("is-ready");

    if (!supportsScrollTimeline && !prefersReducedMotion.matches) {
      fallbackAnimation?.cancel();
      fallbackAnimation = track.animate(
        [
          { transform: "translate3d(0, 0, 0)" },
          { transform: `translate3d(0, ${-distance}px, 0)` },
        ],
        {
          duration: Math.max(28000, pageCount * 3200),
          easing: "linear",
          fill: "forwards",
        },
      );
      fallbackAnimation.pause();
    }
  };

  const load = async () => {
    if (hasLoaded) return;
    hasLoaded = true;

    const fragment = document.createDocumentFragment();
    const images = [];

    for (let page = 1; page <= pageCount; page += 1) {
      const image = document.createElement("img");
      image.src = `${slug}-${padPage(page)}.jpg`;
      image.width = 765;
      image.height = 990;
      image.alt = "";
      image.decoding = "async";
      // The project itself is lazy-mounted by IntersectionObserver. Once mounted,
      // every page is eager so images far below the clipped device viewport also load.
      image.loading = "eager";
      fragment.appendChild(image);
      images.push(image);
    }

    track.appendChild(fragment);

    try {
      await Promise.all(images.map((image) => image.decode()));
      setDistance();
      screen.classList.add("is-loaded");
      screen.setAttribute("aria-label", `${title} 전체 화면 미리보기. 누르면 움직임을 멈출 수 있습니다.`);
    } catch {
      error.hidden = false;
      screen.classList.add("is-loaded");
    }
  };

  const loadingObserver = new IntersectionObserver(
    (entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        load();
        observer.disconnect();
      }
    },
    { rootMargin: "1000px 0px" },
  );

  const playbackObserver = new IntersectionObserver(
    (entries) => {
      const isVisible = entries[0]?.isIntersecting;
      if (!fallbackAnimation || isPausedByUser) return;
      if (isVisible) fallbackAnimation.play();
      else fallbackAnimation.pause();
    },
    { threshold: 0.25 },
  );

  const togglePlayback = () => {
    if (prefersReducedMotion.matches) return;
    isPausedByUser = !isPausedByUser;
    screen.classList.toggle("is-paused", isPausedByUser);
    screen.setAttribute("aria-pressed", String(isPausedByUser));

    if (supportsScrollTimeline) {
      track.style.animationPlayState = isPausedByUser ? "paused" : "running";
    } else if (fallbackAnimation) {
      if (isPausedByUser) fallbackAnimation.pause();
      else fallbackAnimation.play();
    }
  };

  screen.addEventListener("click", togglePlayback);
  screen.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePlayback();
    }
  });

  const resizeObserver = new ResizeObserver(() => {
    if (hasLoaded) setDistance();
  });

  loadingObserver.observe(project);
  playbackObserver.observe(project);
  resizeObserver.observe(screen);
}

document.querySelectorAll(".project").forEach(buildProjectPreview);
