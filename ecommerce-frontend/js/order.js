const API_BASE = "http://localhost:5001";
const ordersList = document.getElementById("orders-list");
const placeOrderBtn = document.getElementById("placeOrderBtn");

// Step UI generator
function getStatusSteps(currentStatus) {
  const steps = ["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered"];
  return steps
    .map(step => {
      const isCompleted = steps.indexOf(step) <= steps.indexOf(currentStatus);
      return `<span class="step ${isCompleted ? "completed" : ""}">${step}</span>`;
    })
    .join(" → ");
}

// Load Orders
async function loadOrders() {
  ordersList.innerHTML = "Loading...";
  try {
    const res = await fetch(`${API_BASE}/api/orders`, { credentials: "include" });
    if (!res.ok) {
      ordersList.innerHTML = "Failed to load orders.";
      return;
    }
    const orders = await res.json();
    if (!orders.length) {
      ordersList.innerHTML = "<li>No orders found</li>";
      return;
    }

    ordersList.innerHTML = "";
    orders.forEach(order => {
      const li = document.createElement("li");
      li.classList.add("order-card");
      li.innerHTML = `
        <div><strong>Order ID:</strong> ${order._id}</div>
        <div><strong>Status:</strong> ${getStatusSteps(order.orderStatus)}</div>
        <div><strong>Total:</strong> ₹${order.totalAmount}</div>
        <div><strong>Shipping:</strong> 
          ${order.shippingAddress?.street || ""}, 
          ${order.shippingAddress?.city || ""}, 
          ${order.shippingAddress?.postalCode || ""}, 
          ${order.shippingAddress?.country || ""}
        </div>
        <div><strong>Items:</strong></div>
        <ul>
          ${(order.products || []).map(i => `
            <li>${i.productId?.name || "Product"} x ${i.quantity} @ ₹${i.price}</li>
          `).join("")}
        </ul>
      `;
      ordersList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    ordersList.innerHTML = "Error loading orders.";
  }
}

// Place order (simulate cart checkout with dummy shipping)
if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", async () => {
    const shippingAddress = {
      street: "123 Main St",
      city: "Hyderabad",
      state: "TG",
      postalCode: "500001",
      country: "India",
    };

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ shippingAddress }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert("Failed to place order: " + err.message);
        return;
      }
      alert("Order placed successfully!");
      loadOrders();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while placing order");
    }
  });
  function displayOrder(order) {
    const li = document.createElement("li");
    li.classList.add("order-card");
    li.innerHTML = `
      <div><strong>Order ID:</strong> ${order._id}</div>
      <div><strong>Status:</strong> ${getStatusSteps(order.orderStatus)}</div>
      <div><strong>Total:</strong> ₹${order.totalAmount}</div>
      <div><strong>Shipping:</strong>
        ${order.shippingAddress?.street || ""}, 
        ${order.shippingAddress?.city || ""}, 
        ${order.shippingAddress?.postalCode || ""}, 
        ${order.shippingAddress?.country || ""}
      </div>
      <div><strong>Items:</strong></div>
      <ul>
        ${(order.products || []).map(i => `
          <li>${i.productId?.name || "Product"} x ${i.quantity} @ ₹${i.price}</li>
        `).join("")}
      </ul>
    `;
    ordersList.prepend(li);
  }
}