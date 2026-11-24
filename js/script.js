document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Reveal sections as they enter the viewport.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("show"));
  }

  // Close the mobile navigation after choosing a section.
  document.querySelectorAll("#mainNav .nav-link, #mainNav .btn").forEach(link => {
    link.addEventListener("click", () => {
      const nav = document.getElementById("mainNav");
      if (nav.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(nav).hide();
      }
    });
  });

  // Back-to-top visibility.
  const backToTop = document.getElementById("backToTop");
  const updateTopButton = () => backToTop.classList.toggle("visible", window.scrollY > 500);
  window.addEventListener("scroll", updateTopButton, { passive: true });
  updateTopButton();
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Web3Forms quote request.
  const form = document.getElementById("quoteForm");
  const result = document.getElementById("formResult");
  if (form && result) {
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const originalText = button.innerHTML;
      button.disabled = true;
      button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Sending...';
      result.textContent = "";
      result.className = "form-result";
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: new FormData(form)
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Unable to send request.");
        form.reset();
        result.textContent = "Thank you! Your request was sent. We'll contact you shortly.";
        result.classList.add("text-success");
      } catch (error) {
        result.textContent = "Sorry, your request could not be sent. Please call (346) 448-1283.";
        result.classList.add("text-danger");
      } finally {
        button.disabled = false;
        button.innerHTML = originalText;
      }
    });
  }
});
