const header = document.querySelector("[data-header]");
const loader = document.querySelector("[data-loader]");
const loaderGate = document.querySelector("[data-loader-gate]");
const loaderVideo = document.querySelector("[data-loader-video]");
const progress = document.querySelector("[data-progress]");
const stage = document.querySelector(".motion-stage");
const stageFrame = document.querySelector("[data-stage-frame]");
const stageImage = document.querySelector("[data-stage-image]");
const stageLabel = document.querySelector("[data-stage-label]");
const filterButtons = document.querySelectorAll("[data-filter]");
const archiveList = document.querySelector("[data-list]");
let archiveItems = document.querySelectorAll("[data-type]");
const revealItems = document.querySelectorAll("[data-reveal]");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const previewItems = document.querySelectorAll("[data-preview]");
const heroFrames = document.querySelectorAll("[data-hero-frame]");
const heroPoster = document.querySelector("[data-hero-poster]");
const directorFrame = document.querySelector("[data-director-frame]");
const heroOverlayItems = document.querySelectorAll(".signature-title, .hero-statement");
const heroAwards = document.querySelector(".hero-awards");
const player = document.querySelector("[data-player]");
const playerFrame = document.querySelector("[data-player-frame]");
const playerClose = document.querySelector("[data-player-close]");

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
};

const syncProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const amount = max > 0 ? window.scrollY / max : 0;
  progress.style.transform = `scaleX(${amount})`;
};

const syncParallax = () => {
  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.speed || 0);
    const rect = item.getBoundingClientRect();
    const travel = (window.innerHeight / 2 - rect.top) * speed;
    item.style.transform = `translate3d(0, ${travel}px, 0)`;
  });
};

const syncHeroOverlay = () => {
  const fade = Math.min(window.scrollY / Math.max(120, window.innerHeight * 0.22), 1);
  heroOverlayItems.forEach((item) => {
    item.style.opacity = String(1 - fade);
    item.style.pointerEvents = fade > 0.96 ? "none" : "";
  });
};

const syncScroll = () => {
  syncHeader();
  syncProgress();
  syncParallax();
  syncHeroOverlay();
};

window.addEventListener("scroll", syncScroll, { passive: true });
window.addEventListener("resize", syncScroll);
syncHeader();
syncProgress();
syncParallax();

const setupAwardsMarquee = () => {
  if (!heroAwards || heroAwards.querySelector(".awards-track")) return;
  const track = document.createElement("div");
  track.className = "awards-track";
  Array.from(heroAwards.children).forEach((child) => track.appendChild(child));
  Array.from(track.querySelectorAll(".laurel")).forEach((award) => {
    track.appendChild(award.cloneNode(true));
  });
  const awardLink = track.querySelector(".award-link");
  if (awardLink) track.appendChild(awardLink.cloneNode(true));
  heroAwards.appendChild(track);
};

setupAwardsMarquee();

const finishLoader = () => {
  if (!loader) {
    window.dispatchEvent(new Event("intro:complete"));
    return;
  }
  if (loader.classList.contains("is-ending")) return;
  loader.classList.add("is-glitching");
  window.setTimeout(() => {
    loader.classList.add("is-ending");
    window.dispatchEvent(new Event("intro:complete"));
  }, 360);
  window.setTimeout(() => {
    loader.remove();
  }, 1040);
};

if (loaderVideo && loaderGate) {
  const syncLoaderGlitch = () => {
    if (!loaderVideo.duration) return;
    if (loaderVideo.duration - loaderVideo.currentTime < 0.62) {
      finishLoader();
    }
  };

  const startLoaderVideo = () => {
    if (!loader || loader.classList.contains("has-started")) return;
    loader.classList.add("has-started");
    loaderVideo.currentTime = 0;
    loaderVideo.muted = false;
    loaderVideo.volume = 1;
    const playPromise = loaderVideo.play?.();
    playPromise?.catch?.(() => {
      loaderVideo.muted = true;
      loaderVideo.play?.().catch(() => window.setTimeout(finishLoader, 1200));
    });
    window.setTimeout(finishLoader, 7600);
  };

  loaderVideo.addEventListener("timeupdate", syncLoaderGlitch, { passive: true });
  loaderVideo.addEventListener("ended", finishLoader);
  loaderGate.addEventListener("click", startLoaderVideo);
} else {
  window.setTimeout(finishLoader, 1200);
}

window.addEventListener("load", () => {
  if (!window.location.hash) return;
  window.setTimeout(() => document.querySelector(window.location.hash)?.scrollIntoView(), 120);
});

document.addEventListener("click", (event) => {
  const link = event.target.closest?.('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute("href"));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView();
  history.pushState(null, "", link.getAttribute("href"));
});

const heroVideos = [
  { id: "1178215717", title: "GENERATIONS" },
  { id: "1175187633", title: "COLACAO PULSERA" },
  { id: "1154602703", title: "MediaMarkt B2B SUPERVELOCIDAD" },
  { id: "1148707853", title: "TELEPIZZA MAESTRAS PILATES" },
  { id: "1133944787", title: "Telepizza Pizza Loca" },
  { id: "1133939932", title: "IDEALISTA Treintañero" },
  { id: "1069892313", title: "Fresh 0.0" },
  { id: "1069284106", title: "GLOVO Food&More" },
  { id: "365093075", title: "OLX Super Mama" },
  { id: "891276537", title: "Orange x Google Pixel 8" },
  { id: "875711698", title: "SALSAS PRIMA Ketchup Cero" },
  { id: "843993979", title: "Rolly'n GALLO" },
  { id: "747358711", title: "Glovo 7.0" },
  { id: "418487117", title: "ACTIVIA - Gracias por haberos cuidado dentro" },
  { id: "702932574", title: "LUNK TRAILER" },
  { id: "370118720", title: "Fotocasa" },
  { id: "334851860", title: "SOJASUN" },
  { id: "271662129", title: "Everyou Trailer" },
  { id: "254892638", title: "Burger King - Apalanquer Day" },
  { id: "192324255", title: "Wallapoop Estaremos Preparados" },
  { id: "1189317319", title: "Call Mom" },
];

let heroIndex = 0;
let activeHeroFrame = 0;
let heroIsTransitioning = false;
let heroLoopStarted = false;

const heroSrc = (id) =>
  `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=0&controls=0&autopause=0&title=0&byline=0&portrait=0&playsinline=1&quality=720p`;

const setDirectorVideo = (id, title = "") => {
  if (!directorFrame) return;
  directorFrame.title = title ? `${title} director negative` : "";
  directorFrame.src = heroSrc(id);
};

const rotateHeroVideo = () => {
  if (heroFrames.length < 2 || heroIsTransitioning) return;
  heroIsTransitioning = true;
  heroIndex = (heroIndex + 1) % heroVideos.length;
  const nextFrameIndex = activeHeroFrame === 0 ? 1 : 0;
  const nextFrame = heroFrames[nextFrameIndex];
  const currentFrame = heroFrames[activeHeroFrame];
  const video = heroVideos[heroIndex];
  if (heroPoster) heroPoster.src = `https://vumbnail.com/${video.id}.jpg`;
  nextFrame.title = `${video.title} by Pedro B. Abreu`;
  nextFrame.src = heroSrc(video.id);
  setDirectorVideo(video.id, video.title);
  window.setTimeout(() => {
    nextFrame.classList.add("active");
    currentFrame.classList.remove("active");
    activeHeroFrame = nextFrameIndex;
    window.setTimeout(() => {
      if (!currentFrame.classList.contains("active")) currentFrame.src = "";
      heroIsTransitioning = false;
    }, 1200);
  }, 900);
};

const startHeroLoop = () => {
  if (heroLoopStarted || heroFrames.length < 2) return;
  heroLoopStarted = true;
  heroIndex = 0;
  activeHeroFrame = 0;
  heroIsTransitioning = false;
  heroFrames.forEach((frame, index) => {
    frame.classList.toggle("active", index === 0);
    frame.src = "";
  });
  if (heroPoster) {
    heroPoster.src = `https://vumbnail.com/${heroVideos[0].id}.jpg`;
    heroPoster.classList.add("is-visible");
  }
  heroFrames[0].title = `${heroVideos[0].title} by Pedro B. Abreu`;
  heroFrames[0].src = heroFrames[0].dataset.src || heroSrc(heroVideos[0].id);
  window.setTimeout(() => {
    heroPoster?.classList.remove("is-visible");
  }, 1200);
  setDirectorVideo(heroVideos[0].id, heroVideos[0].title);
  window.clearInterval(window.__heroVideoTimer);
  window.__heroVideoTimer = window.setInterval(rotateHeroVideo, 6500);
};

window.addEventListener("intro:complete", startHeroLoop, { once: true });

if (!loader) {
  startHeroLoop();
}

const archiveVideos = [
  ["1189317319", "Call Mom", "film", "Film"],
  ["1178215717", "GENERATIONS", "film", "AI reel"],
  ["1175187633", "COLACAO PULSERA", "commercial", "Commercial"],
  ["1154603514", "The Black Swan Event", "film", "Film"],
  ["1154602703", "MediaMarkt B2B SUPERVELOCIDAD", "commercial", "Commercial"],
  ["1154602034", "MediaMarkt B2B SUPERTELEPORTACION", "commercial", "Commercial"],
  ["1154600767", "MediaMarkt B2B SUPERGIRO", "commercial", "Commercial"],
  ["1153543246", "MEDIAMARKT B2B", "commercial", "Commercial"],
  ["1148707853", "TELEPIZZA MAESTRAS PILATES", "commercial", "Commercial"],
  ["1148706847", "TELEPIZZA MAESTRAS COMICENA", "commercial", "Commercial"],
  ["1133944787", "Telepizza Pizza Loca", "commercial", "Commercial"],
  ["1133942610", "Telepizza Semana Loca", "commercial", "Commercial"],
  ["1133941295", "Telepizza + Planes", "commercial", "Commercial"],
  ["1133939932", "IDEALISTA Treintañero", "commercial", "Commercial"],
  ["1133937590", "IDEALISTA Hip! otecas", "commercial", "Commercial"],
  ["1099609123", "KH7 MULTIMARCA LITUANIA", "commercial", "Commercial"],
  ["1099308921", "I Drink My Passion", "film", "Film"],
  ["1069892313", "Fresh 0.0", "commercial", "Commercial"],
  ["1069284106", "GLOVO Food&More", "commercial", "Commercial"],
  ["948420326", "GingiLACER", "commercial", "Commercial"],
  ["948416523", "GLOVAGO", "commercial", "Commercial"],
  ["891276537", "Orange x Google Pixel 8", "commercial", "Commercial"],
  ["875737012", "LIDL Cuesta de Enero", "commercial", "Commercial"],
  ["875711698", "SALSAS PRIMA Ketchup Cero", "commercial", "Commercial"],
  ["875706236", "SALSAS PRIMA Barbacoa", "commercial", "Commercial"],
  ["875699309", "CASTILLO DE HOLANDA Maestro", "commercial", "Commercial"],
  ["875694587", "MEDIA MARKT", "commercial", "Commercial"],
  ["847135565", "GLOVO 10.0", "commercial", "Commercial"],
  ["847131730", "GLOVO AFRICA", "commercial", "Commercial"],
  ["843993979", "Rolly'n GALLO", "commercial", "Commercial"],
  ["802078193", "Glovo Magnets", "commercial", "Commercial"],
  ["747358711", "Glovo 7.0", "commercial", "Commercial"],
  ["731685376", "VOLOTEA trailer France", "commercial", "Commercial"],
  ["731682086", "GLOVO Dinner Africa", "commercial", "Commercial"],
  ["731670728", "Aguagym by Fontvella", "commercial", "Commercial"],
  ["705413537", "EL POZO Bienstar", "commercial", "Commercial"],
  ["702932574", "LUNK TRAILER", "film", "Series"],
  ["645223195", "Glovo! UKR", "commercial", "Commercial"],
  ["645195214", "NS EDURNE", "commercial", "Commercial"],
  ["428438957", "Castillo de Holanda", "commercial", "Commercial"],
  ["407507101", "Milanuncios TE LO CANTAMOS BIS", "commercial", "Commercial"],
  ["383782807", "LYNX HAIRDRESSER", "commercial", "Commercial"],
  ["383779091", "LYNX RESTAURANT", "commercial", "Commercial"],
  ["383776676", "LYNX TAXI", "commercial", "Commercial"],
  ["383763335", "Milanuncios TE LO CANTAMOS", "commercial", "Commercial"],
  ["370118720", "Fotocasa", "commercial", "Commercial"],
  ["365112330", "AMV Abrir Gas", "commercial", "Commercial"],
  ["365108438", "AMV Montar en Burra", "commercial", "Commercial"],
  ["365093075", "OLX Super Mama", "commercial", "Commercial"],
  ["365090773", "OLX Super Student", "commercial", "Commercial"],
  ["334851860", "SOJASUN", "commercial", "Commercial"],
  ["300578892", "Cornetto Bumpers", "commercial", "Commercial"],
  ["290370162", "SPARK", "film", "Film"],
  ["290368482", "Glovo", "commercial", "Commercial"],
  ["271662129", "Everyou Trailer", "film", "Film"],
  ["271659715", "Oikos Last Call", "commercial", "Commercial"],
  ["271656636", "OIKOS Home alone", "commercial", "Commercial"],
  ["271654341", "OIKOS Heels", "commercial", "Commercial"],
  ["254892638", "Burger King - Apalanquer Day", "commercial", "Commercial"],
  ["245977549", "Burger King en Casa - Yo de Futbol...", "commercial", "Commercial"],
  ["245267159", "Letsbonus LetsXmas", "commercial", "Commercial"],
  ["245267142", "Letsbonus rock", "commercial", "Commercial"],
  ["245267128", "Letsbonus postits", "commercial", "Commercial"],
  ["245267105", "Letsbonus Pato", "commercial", "Commercial"],
  ["245267076", "Letsbonus mono", "commercial", "Commercial"],
  ["244691606", "Burger King en Casa", "commercial", "Commercial"],
  ["221823781", "Easy Swimmer - Mi verano Intex", "commercial", "Commercial"],
  ["221822380", "Party Animal - Mi verano Intex", "commercial", "Commercial"],
  ["221821694", "Battlefield backyard - Mi verano Intex", "commercial", "Commercial"],
  ["216033616", "ONCE Dia del Padre", "commercial", "Commercial"],
  ["214999513", "ONCE Extra del Dia de la Madre", "commercial", "Commercial"],
  ["192324255", "Wallapoop Estaremos Preparados", "commercial", "Commercial"],
  ["168356088", "Red Bull BCOne Western European Final 2015", "film", "Event"],
  ["129124182", "Paula Rojo - Miedo a querer", "music", "Music video"],
  ["124405748", "Kiss the bride", "film", "Film"],
  ["111852197", "CEPSA", "commercial", "Commercial"],
  ["110482595", "DAVID BUSTAMANTE - Feliz", "music", "Music video"],
  ["90238839", "Mixta PisoX", "commercial", "Commercial"],
  ["90238838", "Mixta DisfraceX", "commercial", "Commercial"],
  ["90238837", "Pensamiento COUNTRY", "commercial", "Commercial"],
  ["90230371", "Pensamiento CAMPUS", "commercial", "Commercial"],
  ["90230370", "Pensamiento UNIVERSIDAD", "commercial", "Commercial"],
  ["90230368", "Pensamiento PULGON", "commercial", "Commercial"],
  ["90230367", "Pensatiesto Mixta", "commercial", "Commercial"],
  ["90230366", "Pensamiento HULK", "commercial", "Commercial"],
  ["77497042", "Juntos", "film", "Film"],
  ["76436180", "Saturday Kids - Boulevard", "music", "Music video"],
  ["75773149", "El Monte de la Luna", "film", "Film"],
  ["75013792", "Endesa Rostros Hombre", "commercial", "Commercial"],
  ["75012984", "Endesa Rostros Chica", "commercial", "Commercial"],
  ["74313820", "Thorpedians - Hurt so badly", "music", "Music video"],
  ["68617557", "Mixta ToallaX", "commercial", "Commercial"],
  ["68608530", "Mixta PelucheX", "commercial", "Commercial"],
  ["68608099", "Mixta CiranoX", "commercial", "Commercial"],
  ["68608098", "Mixta CamisetaX", "commercial", "Commercial"],
  ["68608096", "Mixta BiciX", "commercial", "Commercial"],
  ["68608095", "Mixta PincodeX", "commercial", "Commercial"],
  ["68608094", "Mixta NoticiaX", "commercial", "Commercial"],
  ["68605144", "Farmaindustria", "commercial", "Commercial"],
  ["68129971", "UAX", "commercial", "Commercial"],
  ["68129970", "Mixta Pensamiento", "commercial", "Commercial"],
  ["67637833", "Calle 13 Bano", "commercial", "Commercial"],
  ["67637832", "Calle 13 Tiroteo", "commercial", "Commercial"],
  ["67589851", "Pablo Alboran - Quien", "music", "Music video"],
  ["32178305", "Teaser BR Subtitles", "film", "Film"],
  ["31820651", "BR Teaser", "film", "Film"],
];

const renderArchive = () => {
  if (!archiveList) return;
  if (archiveList.children.length) {
    archiveItems = document.querySelectorAll("[data-type]");
    return;
  }
  archiveList.innerHTML = archiveVideos
    .map(([id, title, type, label], index) => {
      const number = String(index + 1).padStart(2, "0");
      return `<a href="https://vimeo.com/${id}" data-type="${type}" data-title="${title}" data-vimeo="${id}"><span>${number}</span><strong>${title}</strong><em>${label}</em></a>`;
    })
    .join("");
  archiveItems = document.querySelectorAll("[data-type]");
};

renderArchive();

const archiveBrandNames = [
  "MediaMarkt B2B",
  "The Black Swan Event",
  "Castillo de Holanda",
  "SALSAS PRIMA",
  "Burger King",
  "Easy Swimmer",
  "Party Animal",
  "Battlefield backyard",
  "Red Bull BCOne",
  "Paula Rojo",
  "Kiss the bride",
  "David Bustamante",
  "Pablo Alboran",
  "Calle 13",
  "Teaser BR",
  "COLACAO",
  "Telepizza",
  "Idealista",
  "Glovo",
  "GLOVO",
  "Orange",
  "LIDL",
  "Fresh",
  "GingiLACER",
  "MEDIA MARKT",
  "Volotea",
  "EL POZO",
  "LUNK",
  "LYNX",
  "Milanuncios",
  "Fotocasa",
  "AMV",
  "OLX",
  "SOJASUN",
  "Cornetto",
  "SPARK",
  "Everyou",
  "Oikos",
  "OIKOS",
  "Letsbonus",
  "ONCE",
  "Wallapoop",
  "CEPSA",
  "Mixta",
  "Pensamiento",
  "Thorpedians",
  "Farmaindustria",
  "UAX",
  "BR",
].sort((a, b) => b.length - a.length);

const splitArchiveTitle = (title) => {
  const cleanTitle = title.replace(/\s+/g, " ").trim();
  const lowerTitle = cleanTitle.toLocaleLowerCase("es-ES");
  const brand = archiveBrandNames.find((item) => lowerTitle.startsWith(item.toLocaleLowerCase("es-ES")));
  if (brand) {
    return {
      brand,
      detail: cleanTitle.slice(brand.length).replace(/^[\s\-–—:]+/, ""),
    };
  }
  const [first = "", ...rest] = cleanTitle.split(" ");
  return { brand: first, detail: rest.join(" ") };
};

const formatArchiveTitles = () => {
  archiveList?.querySelectorAll("a[data-title] strong").forEach((title) => {
    const rawTitle = title.closest("a").dataset.title || title.textContent || "";
    const { brand, detail } = splitArchiveTitle(rawTitle);
    title.innerHTML = `<span class="archive-title-brand">${brand.toLocaleUpperCase("es-ES")}</span>${
      detail ? ` <span class="archive-title-detail">${detail.toLocaleLowerCase("es-ES")}</span>` : ""
    }`;
  });
};

formatArchiveTitles();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const setStage = (item) => {
  const hoverFrame = item.querySelector?.("iframe[data-src]");
  if (hoverFrame && !hoverFrame.src) hoverFrame.src = hoverFrame.dataset.src;
  const isArchivePreview = Boolean(item.closest?.(".archive-list"));
  const preview = item.dataset.preview;
  const vimeo = item.dataset.vimeo;
  if (vimeo && stageFrame) {
    stageImage.classList.remove("active");
    stageFrame.classList.remove("active");
    window.setTimeout(() => {
      stageFrame.src = `https://player.vimeo.com/video/${vimeo}?autoplay=1&muted=1&loop=1&controls=0&autopause=0&title=0&byline=0&portrait=0&playsinline=1&quality=540p`;
      stageFrame.classList.add("active");
    }, 90);
  } else if (preview && stageImage) {
    stageFrame.classList.remove("active");
    stageImage.classList.remove("active");
    window.setTimeout(() => {
      stageImage.src = preview;
      stageImage.classList.add("active");
    }, 90);
  }
  stageLabel.textContent = item.dataset.title || "Work";
  stage.classList.toggle("is-archive", isArchivePreview);
  stage.classList.add("is-active");
};

document.querySelectorAll("[data-project], [data-preview]").forEach((item) => {
  item.addEventListener("mouseenter", () => setStage(item));
  item.addEventListener("focusin", () => setStage(item));
  item.addEventListener("mouseleave", () => stage.classList.remove("is-active", "is-archive"));
  item.addEventListener("focusout", () => stage.classList.remove("is-active", "is-archive"));
});

archiveList?.addEventListener("mouseover", (event) => {
  const item = event.target.closest("[data-vimeo]");
  if (item) setStage(item);
});

archiveList?.addEventListener("mouseleave", () => {
  stage.classList.remove("is-active", "is-archive");
});

const getVimeoId = (element) => {
  const source = element.closest("[data-vimeo]") || element;
  if (source.dataset.vimeo) return source.dataset.vimeo;
  const href = source.getAttribute("href") || "";
  return href.match(/vimeo\.com\/(\d+)/)?.[1] || "";
};

const openPlayer = (id) => {
  if (!id || !player || !playerFrame) return;
  playerFrame.src = `https://player.vimeo.com/video/${id}?autoplay=1&muted=0&title=0&byline=0&portrait=0`;
  player.classList.add("is-open");
  player.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  return true;
};

window.playVimeo = (event, id) => {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  event?.stopImmediatePropagation?.();
  openPlayer(id);
  return false;
};

const closePlayer = () => {
  if (!player || !playerFrame) return;
  player.classList.remove("is-open");
  player.setAttribute("aria-hidden", "true");
  playerFrame.src = "";
  document.body.style.overflow = "";
};

document.addEventListener("click", (event) => {
  const link = event.target.closest?.('a[href*="vimeo.com"]');
  if (!link) return;
  const id = getVimeoId(link);
  if (!id) return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation?.();
  openPlayer(id);
}, true);

playerClose?.addEventListener("click", closePlayer);
player?.addEventListener("click", (event) => {
  if (event.target === player) closePlayer();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePlayer();
});

document.addEventListener("click", (event) => {
  const button = event.target.closest?.("[data-filter]");
  if (!button) return;
  const filter = button.dataset.filter;
  filterButtons.forEach((item) => item.classList.toggle("active", item === button));
  archiveList?.querySelectorAll("[data-type]").forEach((item) => {
    const visible = filter === "all" || item.dataset.type === filter;
    item.classList.toggle("is-hidden", !visible);
  });
});
