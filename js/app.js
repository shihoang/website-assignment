function isValidEmail(email) {
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
}

function toggleSkillCard(card) {
  if (!card) return;

  const body = card.querySelector(".skill-body");
  const btn = card.querySelector(".skill-toggle");

  if (!body || !btn) return;

  const isHidden = body.classList.contains("hide");

  if (isHidden) {
    body.classList.remove("hide");
    btn.textContent = "View Less";
    btn.setAttribute("aria-expanded", "true");
    card.classList.add("open");
  } else {
    body.classList.add("hide");
    btn.textContent = "View More";
    btn.setAttribute("aria-expanded", "false");
    card.classList.remove("open");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  (function ensureInjectedStyles() {
    if (!document.getElementById("__injected_hide_style__")) {
      const style = document.createElement("style");
      style.id = "__injected_hide_style__";
      style.textContent = `
        .hide { display: none !important; }
        .error-text { color: #dc3545; font-size: 12px; display: none; margin-top: 5px; }
        .is-invalid { border-color: #dc3545 !important; }
        .skill-card.open .skill-toggle {
            background-color: #007bff;
            color: white;
        }
      `;
      document.head.appendChild(style);
    }
  })();

  const gateEl = document.getElementById("email-gate");
  const formEl = document.getElementById("email-form");
  const inputEl = document.getElementById("email-input");
  const errorEl = document.getElementById("email-error");
  const personalEl = document.getElementById("personal-info");

  // Define the exact email required for access
  const REQUIRED_EMAIL = "slender2036@gmail.com";

  if (errorEl) errorEl.style.display = "none";

  function showError(msg) {
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.style.display = "block";
    }
    if (inputEl) inputEl.classList.add("is-invalid");
  }

  function clearError() {
    if (errorEl) errorEl.style.display = "none";
    if (inputEl) inputEl.classList.remove("is-invalid");
  }

  try {
    // If the 'cv_email_verified' flag is set in localStorage, auto-open.
    // NOTE: This assumes that if the flag is '1', the correct email was entered previously.
    // If you want to enforce re-entering the specific email on *every* session,
    // you would remove this localStorage check or store the actual email in localStorage.
    if (localStorage.getItem("cv_email_verified") === "1") {
      if (gateEl) gateEl.classList.add("hide");
      if (personalEl) personalEl.classList.remove("hide");
    }
  } catch (e) {
    console.warn("Error accessing localStorage:", e);
  }

  if (inputEl) {
    inputEl.addEventListener("input", clearError);
  }

  if (formEl) {
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();

      const value = (inputEl && inputEl.value ? inputEl.value : "").trim();

      if (!value) {
        showError("Please enter your email.");
      } else if (!isValidEmail(value)) {
        showError("Invalid email format (e.g., name@example.com).");
      } else if (value.toLowerCase() !== REQUIRED_EMAIL.toLowerCase()) {
        // NEW: Check for exact email match
        showError(
          "The entered email does not match the required email address."
        );
      } else {
        clearError();
        if (gateEl) gateEl.classList.add("hide");
        if (personalEl) personalEl.classList.remove("hide");
        try {
          localStorage.setItem("cv_email_verified", "1");
        } catch (e) {
          console.warn("Error saving to localStorage:", e);
        }
      }
    });
  }

  const jobInfoSection = document.getElementById("job-info");
  if (jobInfoSection) {
    jobInfoSection.querySelectorAll(".job-box").forEach((jobCard) => {
      jobCard.classList.add("skill-card");

      const header = jobCard.querySelector(".box-title");
      const body = jobCard.querySelector(".job-content");

      if (header && body) {
        header.classList.add("skill-header");
        body.classList.add("skill-body");

        let btn = header.querySelector(".skill-toggle");
        if (!btn) {
          btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn btn-sm btn-outline-primary skill-toggle";
          btn.textContent = "View More";
          header.appendChild(btn);
        }
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll(".skill-card").forEach((card) => {
    const header = card.querySelector(".skill-header");
    const body = card.querySelector(".skill-body");
    const toggleButton = card.querySelector(".skill-toggle");

    if (body) {
      body.classList.add("hide");
    }

    if (header) {
      header.tabIndex = 0;

      header.addEventListener("click", function (e) {
        if (e.target.closest(".skill-toggle")) {
          return;
        }
        e.preventDefault();
        toggleSkillCard(card);
      });

      header.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleSkillCard(card);
        }
      });
    }

    if (toggleButton) {
      toggleButton.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        toggleSkillCard(card);
      });
    }
  });
});
