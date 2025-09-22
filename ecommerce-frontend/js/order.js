function getStatusSteps(currentStatus) {
  const steps = [
    "Pending",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];
  return steps
    .map((step) => {
      const isCompleted = steps.indexOf(step) <= steps.indexOf(currentStatus);
      return `<span class="step ${isCompleted ? "completed" : ""}">${step}</span>`;
    })
    .join(" → ");
}

async function loadOrders() {
  ordersList.innerHTML = "Loading...";
  try {
    const res = await fetch(`${API_BASE}/api/orders`, { credentials: "include" });
    const orders = await res.json();

    ordersList.innerHTML = "";

    orders.forEach((order) => {
      const li = document.createElement("li");
      li.classList.add("order-card");
      li.innerHTML = `
        <div><strong>Order ID:</strong> ${order._id}</div>
        <div><strong>Status:</strong> ${getStatusSteps(order.orderStatus)}</div>
        <div><strong>Total:</strong> ₹${order.totalAmount}</div>
        <div><strong>Shipping:</strong> ${order.shippingAddress?.street || ""}, 
        ${order.shippingAddress?.city || ""} ${order.shippingAddress?.postalCode || ""}, 
        ${order.shippingAddress?.country || ""}</div>
        <div><strong>Items:</strong></div>
        <ul>
          ${(order.products || []).map((i) => {
            const product = i.productId || {};
            const name = product.name || "Unknown";
            const image = product.images && product.images[0] ? product.images[0] : "";
            const qty = i.quantity;
            const price =
              i.price || product.discountedPrice || product.price || "";
            return `<li style="display:flex; align-items:center; gap:8px;">
              ${image ? `<img src="${image}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;"/>` : ""}
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
