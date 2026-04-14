// Change this password to your own value.
const PRIVATE_PASSWORD = "likun-private";
const ACCESS_KEY = "likun_private_access_granted";

function askForPassword() {
  const input = window.prompt("请输入私人页面密码：");
  if (input === null) {
    return false;
  }
  if (input === PRIVATE_PASSWORD) {
    sessionStorage.setItem(ACCESS_KEY, "1");
    return true;
  }
  window.alert("密码错误");
  return false;
}

document.querySelectorAll('[data-private-link="true"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (askForPassword()) {
      window.location.href = link.getAttribute("href");
    }
  });
});

if (window.location.pathname.endsWith("/private.html")) {
  const granted = sessionStorage.getItem(ACCESS_KEY) === "1";
  if (!granted && !askForPassword()) {
    window.location.href = "./index.html";
  }
}
