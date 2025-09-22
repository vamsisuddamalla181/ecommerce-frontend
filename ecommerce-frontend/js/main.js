const API_BASE = "http://localhost:5001";

// Fetch categories
async function loadCategories() {
  const categoryFilter = document.getElementById("category-filter");

  try {
    const res = await fetch(`${API_BASE}/get-all-category`, {
      credentials: "include"
    });
    const categories = await res.json();

    categoryFilter.innerHTML = `<option value="all">All</option>`;

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = `${cat.name} - ${cat.description || ""}`;
      categoryFilter.appendChild(option);
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
}
loadCategories();

// Fetch products by category
document.getElementById("category-filter").addEventListener("change", async (e) => {
  const selectedCategory = e.target.value;
  const container = document.getElementById("productsContainer");
  container.innerHTML = "Loading...";

  try {
    let url =
      selectedCategory === "all"
        ? `${API_BASE}/api/products`
        : `${API_BASE}/api/products/category/${selectedCategory}`;

    const res = await fetch(url, { credentials: "include" });
    const products = await res.json();

    container.innerHTML = "";
    if (!products.length) {
      container.innerHTML = "No products found.";
      return;
    }

    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${p.images?.[0] || "placeholder.jpg"}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p>
          <span class="old-price">₹${p.price}</span>
          <span class="price">₹${p.discountedPrice}</span>
        </p>
        <button onclick="addToCart('${p._id}')">Add to Cart</button>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    container.innerHTML = "Failed to load products.";
  }
});

// Add to cart
async function addToCart(productId) {
  try {
    const res = await fetch(`${API_BASE}/api/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({ productId, quantity: 1 })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Product added to cart");
    } else {
      if (res.status === 401 || res.status === 403) {
        addToGuestCart(productId, 1);
        alert(" Product added to cart ");
      } else {
        alert(data.message || "Error adding to cart");
      }
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
}

function addToGuestCart(productId, quantity) {
  try {
    const raw = localStorage.getItem("guestCart");
    const cart = raw ? JSON.parse(raw) : [];
    const idx = cart.findIndex((i) => i.productId === productId);
    if (idx >= 0) {
      cart[idx].quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
    localStorage.setItem("guestCart", JSON.stringify(cart));
  } catch (e) {
    console.error("Failed to update guest cart", e);
  }
}

// Initial load
document.getElementById("category-filter").dispatchEvent(new Event("change"));


// function updateNav() {
//   const hasToken = !!localStorage.getItem("token");
//   const loginLink = document.getElementById("nav-login");
//   const logoutLink = document.getElementById("nav-logout");
//   const homeLink = document.getElementById("nav-home");
//   const cartLink = document.getElementById("nav-cart");
//   if(hasToken){
//     loginLink.style.display = "none";
//     logoutLink.style.display = "";
//     homeLink.style.display = "none";
//     cartLink.style.display = "none";
//   }else{
//     loginLink.style.display = "";
//     logoutLink.style.display = "none";
//     homeLink.style.display = "";
//     cartLink.style.display = "";
//   }
// }
// document.addEventListener("DOMContentLoaded", updateNav);
