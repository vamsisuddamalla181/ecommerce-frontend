const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(signupForm).entries());

  try {
    const res = await fetch("http://localhost:5001/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    document.getElementById("signup-message").textContent = result.message;

    if (res.ok) {
      setTimeout(() => (window.location.href = "login.html"), 1500);
    }
  } catch (err) {
    console.error(err);
    document.getElementById("signup-message").textContent =
      "Something went wrong";
  }
});
