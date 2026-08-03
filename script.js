const padPage = (page) => String(page).padStart(2, "0");

function buildProjectPreview(project) {
  const slug = project.dataset.project;
  const pageCount = Number(project.dataset.pages);
  const title = project.dataset.title;
  const screen = project.querySelector(".device-screen");
  const track = project.querySelector(".screen-track");
  const error = project.querySelector(".device-error");
  let hasLoaded = false;

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
      image.loading = "eager";
      fragment.appendChild(image);
      images.push(image);
    }

    track.appendChild(fragment);

    const results = await Promise.allSettled(images.map((image) => image.decode()));
    const loadedImages = images.filter((image) => image.naturalWidth > 0);

    if (loadedImages.length === 0 || results.every((result) => result.status === "rejected")) {
      error.hidden = false;
    }

    screen.classList.add("is-loaded");
    screen.setAttribute("aria-label", `${title} 전체 화면. 손가락, 마우스 휠 또는 방향키로 세로 스크롤하세요.`);
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

  loadingObserver.observe(project);
}

document.querySelectorAll(".project").forEach(buildProjectPreview);

const businessCard = document.querySelector(".business-card");

businessCard?.addEventListener("click", () => {
  const isFlipped = businessCard.classList.toggle("is-flipped");
  businessCard.setAttribute("aria-pressed", String(isFlipped));
});
