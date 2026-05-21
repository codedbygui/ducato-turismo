(function () {
  const body = document.body;
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const cookieBanner = document.querySelector("[data-cookie-banner]");
  const cookieModal = document.querySelector("[data-cookie-modal]");
  const cookieOpenButtons = document.querySelectorAll("[data-cookie-open]");
  const cookieCloseButtons = document.querySelectorAll("[data-cookie-close]");
  const cookieAcceptButtons = document.querySelectorAll("[data-cookie-accept]");
  const cookieRejectButtons = document.querySelectorAll("[data-cookie-reject]");
  const cookieSaveButtons = document.querySelectorAll("[data-cookie-save]");
  const cookieToggles = document.querySelectorAll("[data-cookie-toggle]");
  const survey = document.querySelector("[data-survey]");

  const consentKey = "ducato_cookie_preferences";

  function setMenu(open) {
    body.classList.toggle("menu-open", open);
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", String(open));
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      setMenu(!body.classList.contains("menu-open"));
    });
  }

  if (nav) {
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        setMenu(false);
      }
    });
  }

  function readConsent() {
    try {
      return JSON.parse(localStorage.getItem(consentKey));
    } catch (error) {
      return null;
    }
  }

  function writeConsent(preferences) {
    localStorage.setItem(
      consentKey,
      JSON.stringify({
        ...preferences,
        updatedAt: new Date().toISOString(),
      }),
    );
  }

  function showBannerIfNeeded() {
    if (cookieBanner && !readConsent()) {
      cookieBanner.classList.add("show");
    }
  }

  function hideBanner() {
    if (cookieBanner) {
      cookieBanner.classList.remove("show");
    }
  }

  function openCookieModal() {
    if (cookieModal) {
      cookieModal.classList.add("show");
      body.classList.add("modal-open");
    }
  }

  function closeCookieModal() {
    if (cookieModal) {
      cookieModal.classList.remove("show");
      body.classList.remove("modal-open");
    }
  }

  function applyToggleState(preferences) {
    cookieToggles.forEach((toggle) => {
      const key = toggle.getAttribute("data-cookie-toggle");
      if (key && Object.prototype.hasOwnProperty.call(preferences, key)) {
        toggle.checked = Boolean(preferences[key]);
      }
    });
  }

  function collectToggleState() {
    const preferences = {
      essential: true,
      preferences: false,
      functional: false,
      analytics: false,
    };

    cookieToggles.forEach((toggle) => {
      const key = toggle.getAttribute("data-cookie-toggle");
      if (key) {
        preferences[key] = Boolean(toggle.checked);
      }
    });

    return preferences;
  }

  const savedConsent = readConsent();
  if (savedConsent) {
    applyToggleState(savedConsent);
  }
  showBannerIfNeeded();

  cookieOpenButtons.forEach((button) => {
    button.addEventListener("click", openCookieModal);
  });

  cookieCloseButtons.forEach((button) => {
    button.addEventListener("click", closeCookieModal);
  });

  cookieAcceptButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const preferences = {
        essential: true,
        preferences: true,
        functional: true,
        analytics: true,
      };
      writeConsent(preferences);
      applyToggleState(preferences);
      hideBanner();
      closeCookieModal();
    });
  });

  cookieRejectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const preferences = {
        essential: true,
        preferences: false,
        functional: false,
        analytics: false,
      };
      writeConsent(preferences);
      applyToggleState(preferences);
      hideBanner();
      closeCookieModal();
    });
  });

  cookieSaveButtons.forEach((button) => {
    button.addEventListener("click", () => {
      writeConsent(collectToggleState());
      hideBanner();
      closeCookieModal();
    });
  });

  if (cookieModal) {
    cookieModal.addEventListener("click", (event) => {
      if (event.target === cookieModal) {
        closeCookieModal();
      }
    });
  }

  if (survey) {
    const steps = Array.from(survey.querySelectorAll("[data-survey-step]"));
    const nextButtons = survey.querySelectorAll("[data-survey-next]");
    const prevButtons = survey.querySelectorAll("[data-survey-prev]");
    const progress = survey.querySelector("[data-survey-progress]");
    let currentStep = 0;

    function renderSurvey() {
      steps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep);
      });
      if (progress) {
        progress.textContent = `${currentStep + 1} de ${steps.length}`;
      }
    }

    nextButtons.forEach((button) => {
      button.addEventListener("click", () => {
        currentStep = Math.min(currentStep + 1, steps.length - 1);
        renderSurvey();
      });
    });

    prevButtons.forEach((button) => {
      button.addEventListener("click", () => {
        currentStep = Math.max(currentStep - 1, 0);
        renderSurvey();
      });
    });

    survey.addEventListener("submit", (event) => {
      event.preventDefault();
      alert("Obrigado pela avaliação. Nesta versão estática, o envio será conectado ao serviço definido na hospedagem.");
    });

    renderSurvey();
  }
})();
