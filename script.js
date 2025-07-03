const typingText = document.getElementById("typing-text");
const loader = document.getElementById("loader");
const fullMessage = "hello, welcome to detail.";
const typingSpeed = 100;
const pauseAfterTyping = 800;

const specialStart = fullMessage.indexOf("detail");
const specialEnd = specialStart + "detail".length;

let index = 0;

// Typing effect function
function typeEffect() {
  if (index <= fullMessage.length) {
    let html = "";

    for (let i = 0; i < index; i++) {
      const char = fullMessage[i];

      if (i >= specialStart && i < specialEnd) {
        html += `<span class="brand-name">${char}</span>`;
      } else {
        html += char;
      }
    }

    typingText.innerHTML = html;
    index++;
    setTimeout(typeEffect, typingSpeed);
  } else {
    setTimeout(() => {
      loader.style.transition = "opacity 0.8s ease";
      loader.style.opacity = 0;

      setTimeout(() => {
        loader.remove();
        calculateTotals?.();

        // ✅ SHOW NAVBAR AFTER LOADER FADES OUT
        const navbar = document.getElementById("main-navbar");
        navbar.style.opacity = "0";
        navbar.style.display = "flex";
        setTimeout(() => {
          navbar.style.transition = "opacity 0.5s ease";
          navbar.style.opacity = "1";
        }, 50);

      }, 1000);
    }, pauseAfterTyping);
  }
}


// Only allow numeric input
function allowOnlyNumbers(id) {
  const input = document.getElementById(id);
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "");
  });
}


// Run when DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
  typingText.innerHTML = "";
  typeEffect();

  // Restrict inputs to numeric only
  allowOnlyNumbers("contact-number");
  allowOnlyNumbers("order-number");

  // Set today's date as min for date picker
  const dateInput = document.getElementById("order-date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
  }
});

// Add order item row
function addItem() {
  const table = document.querySelector("#item-list tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" placeholder="Item name" /></td>
    <td><input type="number" value="1" oninput="calculateTotals()" /></td>
    <td><input type="number" value="0" oninput="calculateTotals()" /></td>
    <td>₱0</td>
    <td><button onclick="removeItem(this)">✕</button></td>
  `;
  table.appendChild(row);
  calculateTotals();
}

// Remove order item
function removeItem(btn) {
  const row = btn.closest("tr");
  row.remove();
  calculateTotals();
}

// Calculate all totals
function calculateTotals() {
  const rows = document.querySelectorAll("#item-list tbody tr");
  let subtotal = 0;
  rows.forEach(row => {
    const qty = parseFloat(row.cells[1].querySelector("input").value) || 0;
    const price = parseFloat(row.cells[2].querySelector("input").value) || 0;
    const total = qty * price;
    row.cells[3].textContent = `₱${total.toFixed(2)}`;
    subtotal += total;
  });

  const shippingInput = document.querySelector('input[type="number"][value="0"]');
  const shipping = parseFloat(shippingInput?.value || 0);

  document.querySelectorAll(".summary p span").forEach(span => {
    const text = span.parentElement.textContent;
    if (text.includes("Subtotal")) span.textContent = `₱${subtotal.toFixed(2)}`;
    if (text.includes("Shipping")) span.textContent = `₱${shipping.toFixed(2)}`;
    if (text.includes("Total") && !text.includes("Overall")) span.textContent = `₱${(subtotal + shipping).toFixed(2)}`;
    if (text.includes("Overall")) span.textContent = `₱${(subtotal + shipping).toFixed(2)}`;
  });
}

// Download invoice as image
function downloadAsImage() {
  const element = document.querySelector(".invoice-box");
  const elementsToHide = document.querySelectorAll(".no-image");
  elementsToHide.forEach(el => el.style.display = "none");

  html2canvas(element).then(canvas => {
    const link = document.createElement("a");
    link.download = "invoice.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    elementsToHide.forEach(el => el.style.display = "");
  });
}
