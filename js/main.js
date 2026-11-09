// Booking form goes through the site-forms Cloudflare worker (needs a "thealfanos" entry in its SITES map).
const FORM_ENDPOINT = "https://site-forms.alfanoministries.workers.dev/thealfanos";

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

const form = document.getElementById("bookForm");
const status = document.getElementById("formStatus");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    status.textContent = "Please fill in your name, email and a few words about your event.";
    return;
  }
  const btn = form.querySelector("button");
  btn.disabled = true;
  status.textContent = "Sending...";
  try {
    const data = Object.fromEntries(new FormData(form));
    if (data._honey) return;
    delete data._honey;
    data._subject = "Speaking request from thealfanos.com";
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(res.status);
    form.reset();
    status.textContent = "Thank you. We got your request and will be in touch soon.";
  } catch {
    status.innerHTML = 'Something went wrong. Please email <a href="mailto:marc@thealfanos.com">marc@thealfanos.com</a>.';
  } finally {
    btn.disabled = false;
  }
});
