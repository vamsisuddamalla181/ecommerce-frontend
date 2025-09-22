// const API_BASE = "http://localhost:5001";

// async function loadCart() {
//   const container = document.getElementById("cartContainer");
//   container.innerHTML = "Loading...";

//   try {
//     const res = await fetch(`${API_BASE}/api/cart`, {
//       credentials: "include"
//     });
//     if (res.status === 401 || res.status === 403) {
//       renderGuestCart(container);
//       return;
//     }
//     const cart = await res.json();

//     container.innerHTML = "";
//     if (!cart.items || !cart.items.length) {
//       container.innerHTML = "Your cart is empty.";
//       return;
//     }

//     let total = 0;
//     cart.items.forEach(item => {
//       const div = document.createElement("div");
//       div.className = "cart-item";
//       div.innerHTML = `
//         <p><strong>${item.product.name}</strong> - ${item.quantity} pcs</p>
//         <p>Price: ₹${item.product.discountedPrice}</p>
//         <button class="btn-danger" data-remove-id="${item.product._id}">Remove</button>
//       `;
//       container.appendChild(div);
//       total += (item.product.discountedPrice || item.product.price) * item.quantity;
//     });
//     appendTotalAndCheckout(total);
//   } catch (err) {
//     console.error("Error loading cart:", err);
//     renderGuestCart(container);
//   }
// }

// loadCart();

// function renderGuestCart(container) {
//   try {
//     const raw = localStorage.getItem("guestCart");
//     const guest = raw ? JSON.parse(raw) : [];
//     container.innerHTML = "";
//     if (!guest.length) {
//       container.innerHTML = "Your cart is empty.";
//       return;
//     }
//     let total = 0;
//     guest.forEach((i) => {
//       const div = document.createElement("div");
//       div.className = "cart-item";
//       div.innerHTML = `
//         <p><strong>Product</strong> - ${i.quantity} pcs</p>
//         <p>Item: ${i.productId}</p>
//         <button class="btn-danger" data-remove-guest-id="${i.productId}">Remove</button>
//       `;
//       container.appendChild(div);
//       // price unknown offline; keep total as quantity placeholder
//       total += i.quantity;
//     });
//     appendTotalAndCheckout(total);
//   } catch (e) {
//     container.innerHTML = "Your cart is empty.";
//   }
// }

// function appendTotalAndCheckout(total) {
//   const section = document.getElementById("checkoutSection");
//   if (section) section.style.display = "";
// }

// // Checkout modal interactions
// const openCheckout = document.getElementById("openCheckout");
// const shippingModal = document.getElementById("shippingModal");
// const cancelCheckout = document.getElementById("cancelCheckout");
// const shippingForm = document.getElementById("shippingForm");

// if (openCheckout && shippingModal) {
//   openCheckout.addEventListener("click", () => {
//     shippingModal.style.display = "flex";
//   });
// }
// if (cancelCheckout && shippingModal) {
//   cancelCheckout.addEventListener("click", () => {
//     shippingModal.style.display = "none";
//   });
// }
// if (shippingForm) {
//   shippingForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const formData = new FormData(shippingForm);
//     const address = Object.fromEntries(formData.entries());

//     try {
//       // Try placing order with backend
//       const res = await fetch(`${API_BASE}/api/orders`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ shippingAddress: address })
//       });
//       if (res.status === 401 || res.status === 403) {
//         // Stay on cart; user can choose Login from nav
//         return;
//       }
//       const data = await res.json();
//       if (res.ok) {
//         // clear guest cart on success just in case
//         localStorage.removeItem("guestCart");
//         // try to clear server-side cart as well
//         await clearServerCart();
//         if (shippingModal) shippingModal.style.display = "none";
//         // Redirect to home
//         setTimeout(() => { window.location.replace("index.html"); }, 0);
//       } else {
//         // no alerts requested
//       }
//     } catch (err) {
//       console.error("Order error", err);
//     }
//   });
// }

// // Remove item handlers
// document.addEventListener("click", async (e) => {
//   const target = e.target;
//   if (!(target instanceof HTMLElement)) return;

//   // Logged-in cart remove
//   const removeId = target.getAttribute("data-remove-id");
//   if (removeId) {
//     try {
//       const res = await fetch(`${API_BASE}/api/cart/${removeId}`, {
//         method: "DELETE",
//         credentials: "include"
//       });
//       if (res.ok) {
//         loadCart();
//       } else {
//         const data = await res.json().catch(() => ({}));
//         alert(data.message || "Failed to remove item");
//       }
//     } catch (err) {
//       console.error("Remove error", err);
//       alert("Failed to remove item");
//     }
//   }

//   // Guest cart remove
//   const removeGuestId = target.getAttribute("data-remove-guest-id");
//   if (removeGuestId) {
//     try {
//       const raw = localStorage.getItem("guestCart");
//       const cart = raw ? JSON.parse(raw) : [];
//       const next = cart.filter((i) => i.productId !== removeGuestId);
//       localStorage.setItem("guestCart", JSON.stringify(next));
//       loadCart();
//     } catch (err) {
//       console.error("Guest remove error", err);
//     }
//   }
// });

// // Try to clear the authenticated user's cart (best-effort)
// async function clearServerCart() {
//   try {
//     // Attempt common clear endpoints first
//     let res = await fetch(`${API_BASE}/api/cart/clear`, {
//       method: "POST",
//       credentials: "include"
//     });
//     if (res.ok) return;

//     res = await fetch(`${API_BASE}/api/cart`, {
//       method: "DELETE",
//       credentials: "include"
//     });
//     if (res.ok) return;

//     // Fallback: fetch items and delete one by one
//     const getRes = await fetch(`${API_BASE}/api/cart`, { credentials: "include" });
//     if (!getRes.ok) return;
//     const cart = await getRes.json();
//     if (!cart.items) return;
//     await Promise.all(
//       cart.items.map((it) =>
//         fetch(`${API_BASE}/api/cart/${it.product._id || it.productId}`, {
//           method: "DELETE",
//           credentials: "include"
//         }).catch(() => {})
//       )
//     );
//   } catch (_) {
//     // ignore errors
//   }
// }
















const API_BASE = "http://localhost:5001";

// Format price nicely
function formatPrice(amount) {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;
}

// Load cart (logged-in or guest)
async function loadCart() {
  const container = document.getElementById("cartContainer");
  container.innerHTML = "Loading...";

  try {
    const res = await fetch(`${API_BASE}/api/cart`, { credentials: "include" });

    if (res.status === 401 || res.status === 403) {
      renderGuestCart(container);
      return;
    }

    const cart = await res.json();
    container.innerHTML = "";

    if (!cart.products || !cart.products.length) {
      container.innerHTML = "Your cart is empty.";
      return;
    }

    let total = 0;

    cart.products.forEach((item) => {
      const div = document.createElement("div");
      div.className = "cart-item";

      div.innerHTML = `
        <div class="cart-item-details">
          <h4>${item.product?.name || "Unnamed Product"}</h4>
          <p>Quantity: ${item.quantity}</p>
        </div>
        <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
        <button class="btn-danger" data-remove-id="${item.productId}">Remove</button>
      `;

      container.appendChild(div);
      total += item.price * item.quantity;
    });

    appendTotalAndCheckout(total);
  } catch (err) {
    console.error("Error loading cart:", err);
    renderGuestCart(container);
  }
}

// Render guest cart from localStorage
function renderGuestCart(container) {
  const raw = localStorage.getItem("guestCart");
  const guest = raw ? JSON.parse(raw) : [];
  container.innerHTML = "";

  if (!guest.length) {
    container.innerHTML = "Your cart is empty.";
    return;
  }

  let total = 0;

  guest.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div class="cart-item-details">
        <h4>${item.productName || "Unnamed Product"}</h4>
        <p>Quantity: ${item.quantity}</p>
      </div>
      <div class="cart-item-price">${formatPrice((item.price || 0) * item.quantity)}</div>
      <button class="btn-danger" data-remove-guest-id="${item.productId}">Remove</button>
    `;

    container.appendChild(div);
    total += (item.price || 0) * item.quantity;
  });

  appendTotalAndCheckout(total);
}

// Total + checkout section
function appendTotalAndCheckout(total) {
  const section = document.getElementById("checkoutSection");
  if (!section) return;

  section.innerHTML = `
    <p style="font-weight:bold; font-size:18px;">Total: ${formatPrice(total)}</p>
    <button id="openCheckout" class="btn-primary">Proceed to Order</button>
  `;
}

// Delegated events: remove item, open checkout
document.addEventListener("click", async (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  // Remove logged-in cart item
  const removeId = target.getAttribute("data-remove-id");
  if (removeId) {
    try {
      const res = await fetch(`${API_BASE}/api/cart/${removeId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) loadCart();
    } catch (err) {
      console.error("Remove error:", err);
    }
  }

  // Remove guest cart item
  const removeGuestId = target.getAttribute("data-remove-guest-id");
  if (removeGuestId) {
    const raw = localStorage.getItem("guestCart");
    const cart = raw ? JSON.parse(raw) : [];
    const next = cart.filter((i) => i.productId !== removeGuestId);
    localStorage.setItem("guestCart", JSON.stringify(next));
    loadCart();
  }

  // Open checkout modal
  if (target.id === "openCheckout") {
    const shippingModal = document.getElementById("shippingModal");
    if (shippingModal) shippingModal.style.display = "flex";
  }
});

// Checkout modal interactions
document.addEventListener("DOMContentLoaded", () => {
  const shippingModal = document.getElementById("shippingModal");
  const cancelCheckout = document.getElementById("cancelCheckout");
  const shippingForm = document.getElementById("shippingForm");

  if (cancelCheckout && shippingModal) {
    cancelCheckout.addEventListener("click", () => {
      shippingModal.style.display = "none";
    });
  }

  if (shippingForm) {
    shippingForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(shippingForm);
      const shippingAddress = Object.fromEntries(formData.entries());

      try {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        const isLoggedIn = !!token;

        let res;

        if (isLoggedIn) {
          // Logged-in user
          res = await fetch(`${API_BASE}/api/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify({ shippingAddress }),
          });
        } else {
          // Guest checkout
          const raw = localStorage.getItem("guestCart");
          const guestCart = raw ? JSON.parse(raw) : [];
          if (!guestCart.length) {
            alert("Your cart is empty!");
            return;
          }

          res = await fetch(`${API_BASE}/api/orders/guest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shippingAddress, items: guestCart }),
          });
        }

        const data = await res.json();

        if (res.ok) {
          alert("Order placed successfully!");
          localStorage.removeItem("guestCart");
          if (isLoggedIn) await clearServerCart();
          if (shippingModal) shippingModal.style.display = "none";
          window.location.href = "orders.html";
        } else {
          alert("Failed to place order: " + data.message);
        }
      } catch (err) {
        console.error("Error placing order:", err);
        alert("Something went wrong");
      }
    });
  }
});

// Clear authenticated user's cart
async function clearServerCart() {
  try {
    let res = await fetch(`${API_BASE}/api/cart/clear`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) return;

    res = await fetch(`${API_BASE}/api/cart`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) return;

    const getRes = await fetch(`${API_BASE}/api/cart`, {
      credentials: "include",
    });
    if (!getRes.ok) return;
    const cart = await getRes.json();
    if (!cart.products) return;

    await Promise.all(
      cart.products.map((it) =>
        fetch(`${API_BASE}/api/cart/${it.productId}`, {
          method: "DELETE",
          credentials: "include",
        }).catch(() => { })
      )
    );
  } catch (_) { }
}

// Load cart on page load
document.addEventListener("DOMContentLoaded", loadCart);

// Helper: add item to guest cart
function addToGuestCart(productId, productName, price, quantity = 1) {
  const raw = localStorage.getItem("guestCart");
  const cart = raw ? JSON.parse(raw) : [];
  const existingItem = cart.find((item) => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, productName, price, quantity });
  }
  localStorage.setItem("guestCart", JSON.stringify(cart));
}
