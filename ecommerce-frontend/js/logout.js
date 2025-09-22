(async function logoutUser() {
  try {
    localStorage.removeItem("token");
    const res = await fetch("http://localhost:5001/logout", {
      method: "POST",
      credentials: "include"
    });

    if (res.ok) {
      setTimeout(() => (window.location.href = "login.html"), 1000);
    } else {
      alert("Logout failed!");
    }
  } catch (err) {
    console.error(err);
  }
})();
