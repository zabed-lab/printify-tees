document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("themeToggle");
  const orderForm = document.getElementById("orderForm");
  const openOrder = document.getElementById("openOrder");
  const submitOrder = document.getElementById("submitOrder");
  const message = document.getElementById("message");
  const orderList = document.getElementById("orderList");
  const clearBtn = document.getElementById("clearHistory");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");

  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const sizeInput = document.getElementById("size");
  const qtyInput = document.getElementById("quantity");

  const PRICE_PER_TSHIRT = 399;

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  if (orderList) {
    renderOrders();
  }

  // DARK/LIGHT THEME WITH ROTATION
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      themeBtn.classList.add("theme-toggle-rotate");

      setTimeout(() => {
        themeBtn.classList.remove("theme-toggle-rotate");
      }, 500);

      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      themeBtn.textContent = isDark ? "☀️" : "🌙";
    });
  }

  // HAMBURGER MENU
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  // OPEN ORDER FORM
  if (openOrder && orderForm) {
    openOrder.addEventListener("click", () => {
      orderForm.scrollIntoView({ behavior: "smooth" });
    });
  }

  // SUBMIT ORDER
  if (submitOrder) {
    submitOrder.addEventListener("click", () => {
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const size = sizeInput.value;
      const quantity = Number(qtyInput.value);

      if (!name || !phone || !size || quantity <= 0) {
        message.style.color = "red";
        message.textContent = "❌ Please fill all fields correctly";
        return;
      }

      const totalPrice = quantity * PRICE_PER_TSHIRT;

      const order = {
        name,
        phone,
        size,
        quantity,
        totalPrice,
        time: new Date().toLocaleString(),
      };

      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));
      renderOrders();

      message.style.color = "green";
      message.textContent = "✅ Order placed successfully";

      nameInput.value = "";
      phoneInput.value = "";
      sizeInput.value = "";
      qtyInput.value = "";
    });
  }

  // RENDER ORDER HISTORY
  function renderOrders() {
    orderList.innerHTML = "";
    orders.forEach((order, index) => {
      const div = document.createElement("div");
      div.className = "order-item";
      div.innerHTML = `
        <span>
          <strong>${order.name}</strong><br>
          Size: ${order.size} | Qty: ${order.quantity}<br>
          ₹${order.totalPrice} <small>(${order.time})</small>
        </span>
        <span>#${index + 1}</span>
      `;
      orderList.appendChild(div);
    });
  }

  // CLEAR HISTORY
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all order history?")) {
        orders = [];
        localStorage.removeItem("orders");
        orderList.innerHTML = "";
        message.style.color = "orange";
        message.textContent = "🗑️ Order history cleared";
      }
    });
  }
});

// =======================
// INVENTORY SYSTEM
// =======================
const productName = document.getElementById("productName");
const productStock = document.getElementById("productStock");
const addProductBtn = document.getElementById("addProduct");
const inventoryList = document.getElementById("inventoryList");
const inventoryMsg = document.getElementById("inventoryMsg");

let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

function renderInventory() {
  if (!inventoryList) return;
  inventoryList.innerHTML = "";

  inventory.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "inventory-item";
    div.innerHTML = `
      <span>
        <strong>${item.name}</strong><br>
        Stock: <span class="${item.stock < 5 ? "low-stock" : ""}">
          ${item.stock}
        </span>
      </span>
      <span>#${index + 1}</span>
    `;
    inventoryList.appendChild(div);
  });
}

if (addProductBtn) {
  renderInventory();

  addProductBtn.addEventListener("click", () => {
    const name = productName.value.trim();
    const stock = Number(productStock.value);

    if (!name || stock < 0) {
      inventoryMsg.textContent = "❌ Enter valid product & stock";
      inventoryMsg.style.color = "red";
      return;
    }

    inventory.push({ name, stock });
    localStorage.setItem("inventory", JSON.stringify(inventory));
    renderInventory();

    inventoryMsg.textContent = "✅ Product added";
    inventoryMsg.style.color = "green";

    productName.value = "";
    productStock.value = "";
  });
}
