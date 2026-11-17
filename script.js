const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav-link");
const panels = document.querySelectorAll(".content-panel");
const healthaiToggle = document.querySelector("[data-healthai-toggle]");
const healthaiSection = document.getElementById("healthai");
const healthaiBackButton = document.querySelector("[data-healthai-collapse]");

const setActivePanel = (targetId) => {
  const validTarget = panels.length ? [...panels].find((panel) => panel.id === targetId) : null;
  const activeTarget = validTarget ? targetId : "home";

  panels.forEach((panel) => {
    const isVisible = panel.id === activeTarget;
    panel.classList.toggle("is-visible", isVisible);
    panel.setAttribute("aria-hidden", String(!isVisible));
  });

  navLinks.forEach((link) => {
    const isActive = link.dataset.target === activeTarget;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  const safeHash = activeTarget === "home" ? "#home" : `#${activeTarget}`;
  if (window.location.hash !== safeHash) {
    history.replaceState(null, "", safeHash);
  }
};

const resumeAccordionItems = document.querySelectorAll(".resume-accordion-item");
const updateResumeAccordionState = () => {
  resumeAccordionItems.forEach((item) => {
    const trigger = item.querySelector(".resume-accordion-trigger");
    const panel = item.querySelector(".resume-accordion-panel");
    const isOpen = item.classList.contains("is-open");

    if (trigger) {
      trigger.setAttribute("aria-expanded", String(isOpen));
    }

    if (panel) {
      panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : "0px";
      panel.style.opacity = isOpen ? "1" : "0";
    }
  });
};

const setResumeAccordionState = (openId) => {
  resumeAccordionItems.forEach((item) => {
    const isOpen = openId ? item.dataset.resumeAccordion === openId : false;
    item.classList.toggle("is-open", isOpen);
  });

  updateResumeAccordionState();
};

if (resumeAccordionItems.length) {
  setResumeAccordionState("education");

  document.querySelectorAll(".resume-accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".resume-accordion-item");
      if (!item) return;

      const targetId = item.dataset.resumeAccordion;
      const shouldClose = item.classList.contains("is-open");

      if (shouldClose) {
        setResumeAccordionState();
        return;
      }

      setResumeAccordionState(targetId);
    });
  });

  window.addEventListener("resize", updateResumeAccordionState);
}

const closeMobileMenu = () => {
  if (nav) {
    nav.classList.remove("open");
  }
  if (menuButton) {
    menuButton.setAttribute("aria-expanded", "false");
  }
};

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });
}

const syncSectionFromHash = () => {
  const hash = window.location.hash.replace("#", "");
  if (!hash) {
    setActivePanel("home");
    return;
  }

  if (hash === "healthai") {
    setActivePanel("projects");
  } else if ([...panels].some((panel) => panel.id === hash)) {
    setActivePanel(hash);
  } else {
    setActivePanel("home");
  }
};

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetId = link.dataset.target;
    setActivePanel(targetId);
  });
});

document.querySelectorAll("[data-nav-trigger]").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    const targetId = trigger.dataset.navTrigger;
    if (!targetId) return;
    event.preventDefault();
    setActivePanel(targetId);
  });
});

const setHealthaiState = (expanded) => {
  if (!healthaiToggle || !healthaiSection) return;

  healthaiToggle.setAttribute("aria-expanded", String(expanded));
  healthaiToggle.textContent = expanded ? "Hide Research" : "View Research";
  healthaiSection.classList.toggle("is-open", expanded);
  healthaiSection.setAttribute("aria-hidden", String(!expanded));

  if (expanded) {
    history.replaceState(null, "", "#projects");
    requestAnimationFrame(() => {
      const sectionTop = healthaiSection.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: sectionTop, behavior: "smooth" });
    });
  }
};

if (healthaiToggle && healthaiSection) {
  healthaiToggle.addEventListener("click", (event) => {
    event.preventDefault();
    const isExpanded = healthaiToggle.getAttribute("aria-expanded") === "true";
    setHealthaiState(!isExpanded);
  });

  if (healthaiBackButton) {
    healthaiBackButton.addEventListener("click", () => {
      setHealthaiState(false);
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        const top = projectsSection.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  }
}

const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const profilePhoto = document.getElementById("profilePhoto");
const portraitFallback = document.getElementById("portraitFallback");

if (profilePhoto) {
  profilePhoto.addEventListener("error", () => {
    profilePhoto.style.display = "none";
    if (portraitFallback) {
      portraitFallback.style.display = "flex";
    }
  });
}

window.addEventListener("hashchange", syncSectionFromHash);
syncSectionFromHash();
