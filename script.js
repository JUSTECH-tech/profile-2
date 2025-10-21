/* Shared script for all pages:
   - updateTime: updates #time with current milliseconds + human date/time
   - contact form validation (only active on contact.html)
*/

(function () {
  // Update the footer year(s)
  document.addEventListener("DOMContentLoaded", function () {
    const y = new Date().getFullYear();
    const yearEls = document.querySelectorAll("#year, #year-about, #year-contact");
    yearEls.forEach(el => el && (el.textContent = y));
  });

  /* ---------- Time display (Home page) ---------- */
  function updateTime() {
    const timeEl = document.getElementById("time");
    const dateEl = document.getElementById("date");
    if (!timeEl || !dateEl) return; // not on this page

    const now = new Date();
    // precise milliseconds since epoch
    const ms = now.getTime(); // integer
    // readable date/time
    const human = now.toLocaleString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });

    timeEl.textContent = String(ms);
    dateEl.textContent = human;
  }

  // Update at a reasonable rate (100 ms) to show ms while keeping CPU sane.
  let timerHandle = null;
  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("time")) {
      updateTime();
      timerHandle = setInterval(updateTime, 100);
      // stop if leaving page (optional) — not strictly necessary
      window.addEventListener("beforeunload", function () {
        if (timerHandle) clearInterval(timerHandle);
      });
    }
  });

  /* ---------- Contact form validation ---------- */
  function trimString(s) { return (s || "").toString().trim(); }

  function validateEmail(email) {
    // Simple but robust enough regex for name@example.com style checks
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function showError(id, message) {
    const el = document.getElementById("error-" + id);
    if (!el) return;
    el.textContent = message;
    // associate aria
    const input = document.getElementById("contact-" + id);
    if (input) input.setAttribute("aria-invalid", "true");
  }

  function clearError(id) {
    const el = document.getElementById("error-" + id);
    if (!el) return;
    el.textContent = "";
    const input = document.getElementById("contact-" + id);
    if (input) input.removeAttribute("aria-invalid");
  }

  function clearAllErrors() {
    ["name", "email", "subject", "message"].forEach(clearError);
  }

  function focusFirstInvalid() {
    const fields = ["contact-name", "contact-email", "contact-subject", "contact-message"];
    for (let id of fields) {
      const el = document.getElementById(id);
      if (el && el.getAttribute("aria-invalid") === "true") {
        el.focus();
        return;
      }
    }
  }

  function setupContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      clearAllErrors();
      const name = trimString(document.getElementById("contact-name").value);
      const email = trimString(document.getElementById("contact-email").value);
      const subject = trimString(document.getElementById("contact-subject").value);
      const message = trimString(document.getElementById("contact-message").value);

      let valid = true;

      if (!name) {
        showError("name", "Full name is required.");
        valid = false;
      }

      if (!email) {
        showError("email", "Email is required.");
        valid = false;
      } else if (!validateEmail(email)) {
        showError("email", "Please enter a valid email (name@example.com).");
        valid = false;
      }

      if (!subject) {
        showError("subject", "Subject is required.");
        valid = false;
      }

      if (!message) {
        showError("message", "Message is required.");
        valid = false;
      } else if (message.length < 10) {
        showError("message", "Message must be at least 10 characters.");
        valid = false;
      }

      if (!valid) {
        // ensure screen readers and keyboard users get placed on the first error
        focusFirstInvalid();
        return;
      }

      // success: show success message, clear form, and remove aria-invalid attributes
      const successEl = document.getElementById("contact-success");
      if (successEl) {
        successEl.hidden = false;
        successEl.textContent = "Thanks — your message has been submitted successfully.";
      }

      // Reset form fields (keeping focus on success message for assistive tech)
      form.reset();
      form.querySelectorAll("[aria-invalid]").forEach(el => el.removeAttribute("aria-invalid"));

      // move focus to success element so screen readers announce it
      if (successEl) successEl.focus && successEl.focus();
    });

    // Real-time clearing of errors while typing
    const mapping = {
      "contact-name": "name",
      "contact-email": "email",
      "contact-subject": "subject",
      "contact-message": "message"
    };
    Object.keys(mapping).forEach(inputId => {
      const el = document.getElementById(inputId);
      if (!el) return;
      el.addEventListener("input", function () {
        clearError(mapping[inputId]);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupContactForm();
  });

})();

 document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("a.nav-link");

    links.forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const href = link.getAttribute("href");

        document.body.classList.add("fade-out");

        setTimeout(() => {
          window.location.href = href;
        }, 500); // matches the CSS transition
      });
    });
  });

  // Smooth fade-out transition when navigating
    document.addEventListener("DOMContentLoaded", () => {
      const links = document.querySelectorAll("a.nav-link");

      links.forEach(link => {
        link.addEventListener("click", e => {
          e.preventDefault();
          const href = link.getAttribute("href");
          document.body.classList.add("fade-out");
          setTimeout(() => {
            window.location.href = href;
          }, 500);
        });
      });
    });