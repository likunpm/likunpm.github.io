// Note: This only hides plain text, it is not strong security.
const PRIVATE_PASSWORD_SHA256 = "3d072f821cd6f295625267785405f7141d2efce3e8af92cc222db6ce5b04a2b5";
const ACCESS_KEY = "likun_private_access_granted";

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function askForPassword() {
  const input = window.prompt("请输入私人页面密码：");
  if (input === null) {
    return false;
  }
  const hashedInput = await sha256(input);
  if (hashedInput === PRIVATE_PASSWORD_SHA256) {
    sessionStorage.setItem(ACCESS_KEY, "1");
    return true;
  }
  window.alert("密码错误");
  return false;
}

document.querySelectorAll('[data-private-link="true"]').forEach((link) => {
  link.addEventListener("click", async (event) => {
    event.preventDefault();
    if (await askForPassword()) {
      window.location.href = link.getAttribute("href");
    }
  });
});

// Highlight the nav link corresponding to the visible section
(function () {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { rootMargin: '-15% 0px -75% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
})();

if (window.location.pathname.endsWith("/private.html")) {
  const granted = sessionStorage.getItem(ACCESS_KEY) === "1";
  if (!granted) {
    askForPassword().then((ok) => {
      if (!ok) {
        window.location.href = "./index.html";
      }
    });
  }  
}
