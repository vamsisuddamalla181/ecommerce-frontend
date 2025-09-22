const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(loginForm).entries());

  try {
    const res = await fetch("http://localhost:5001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",  // 🔑 important
      body: JSON.stringify(data),
    });

    const result = await res.json();
    document.getElementById("login-message").textContent = result.message;

    if (res.ok) {
      if (result.token) {
        localStorage.setItem("token", result.token);
        if (typeof window.updateAuthNav === "function") window.updateAuthNav();
      }
      window.location.href = "index.html";
    }
  } catch (err) {
    console.error("Login error:", err);
    document.getElementById("login-message").textContent =
      "Something went wrong. Try again.";
  }
});
