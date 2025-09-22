(() => {
  function updateNav() {
    const hasToken = !!localStorage.getItem("token");
    const loginLink = document.getElementById("nav-login");
    const logoutLink = document.getElementById("nav-logout");

    if (loginLink) loginLink.style.display = hasToken ? "none" : "";
    if (logoutLink) logoutLink.style.display = hasToken ? "" : "none";
  }

  document.addEventListener("DOMContentLoaded", updateNav);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateNav();
  });
  window.addEventListener("focus", updateNav);
  window.addEventListener("storage", updateNav);
 
  window.updateAuthNav = updateNav;

  document.addEventListener("click", async (e) => {
    const target = e.target;
    if (target && target instanceof HTMLElement && target.id === "nav-logout") {
      e.preventDefault();
      try {
        localStorage.removeItem("token");
        await fetch("http://localhost:5001/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch (_) {
        // ignore
      } finally {
        window.location.href = "login.html";
      }
    }
  });
})();


