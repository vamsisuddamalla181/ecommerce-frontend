const API_BASE = "http://localhost:5001";

// Load orders
const ordersList = document.getElementById("orders-list");
if (ordersList) {
  async function loadOrders() {
    ordersList.innerHTML = "Loading...";
    try {
      const res = await fetch(`${API_BASE}/api/orders`, { credentials: "include" });
      const orders = await res.json();

      ordersList.innerHTML = "";

      orders.forEach(order => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>Status:</strong> ${order.orderStatus || order.status} <br>
          <strong>Total:</strong> ₹${order.totalAmount} <br>
          <strong>Shipping:</strong> ${order.shippingAddress?.street || ""}, ${order.shippingAddress?.city || ""} ${order.shippingAddress?.postalCode || ""}, ${order.shippingAddress?.country || ""}
          <div><strong>Items:</strong></div>
          <ul>
            ${(order.products || order.items || []).map(i => {
              const product = i.product || i.productId || {};
              const name = product.name || i.productName || product;
              const image = product.images && product.images[0] ? product.images[0] : null;
              const qty = i.quantity;
              const price = i.price || product.discountedPrice || product.price || "";
              return `<li style="display:flex; align-items:center; gap:8px;">
                ${image ? `<img src="${image}" alt="${name}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;"/>` : ""}
                <span>${name} x ${qty} @ ₹${price}</span>
              </li>`;
            }).join("")}
          </ul>
        `;
        ordersList.appendChild(li);
      });

    } catch (err) {
      console.error(err);
      ordersList.innerHTML = "Failed to load orders.";
    }
  }

  loadOrders();
}

