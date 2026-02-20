// ================= LOADER =================
window.onload = () => {
  const loader = document.querySelector(".loader");
  if (loader) loader.style.display = "none";
};

// ================= MOUSE GLOW =================
document.addEventListener("mousemove", e => {
  const glow = document.querySelector(".glow");
  if (!glow) return;
  glow.style.left = e.clientX - 150 + "px";
  glow.style.top = e.clientY - 150 + "px";
});

// ================= OPEN QR POPUP =================
function openQR() {
  document.getElementById("popup").style.display = "flex";
}

// ================= CLOSE QR + SHOW UPLOAD =================
function closeQR() {
  document.getElementById("popup").style.display = "none";
  document.getElementById("paidBox").style.display = "block";
}

// ================= SEND PAYMENT + EMAIL =================
async function submitPaid() {
  const email = document.getElementById("email").value;
  const file = document.getElementById("ss").files[0];

  if (!email || !file) {
    alert("❌ Email & Screenshot required");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("screenshot", file);

    fetch("https://notdhruv-fx-website.onrender.com/send-email", {
  method: "POST",
  body: formData
});

    const text = await res.text();

    if (text.toLowerCase().includes("sent")) {
      alert("✅ Payment received!\nDownload link sent to email.\n(Check spam too)");
    } else {
      alert("❌ Email failed. Check server.");
    }

  } catch (err) {
    console.error(err);
    alert("❌ Backend not responding");
  }
}

// ================= 3D TILT EFFECT =================
document.querySelectorAll(".tilt").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y / rect.height - 0.5) * -20;
    const rotateY = (x / rect.width - 0.5) * 20;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0)";
  });
});
