// ================= IMPORTS =================
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

// ================= EXPRESS =================
const app = express();
app.use(cors());
app.use(express.json());

// ================= UPLOAD FOLDER =================
const uploadPath = path.join(__dirname, "uploads");

// Create uploads folder safely
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📁 Upload folder created");
}

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ================= EMAIL TRANSPORT =================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: "notdhruv.fx@gmail.com",
    pass: "okvrlyqvxqeahuxb"
  },

  tls: {
    rejectUnauthorized: false
  }
});

// Test email connection on start
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email config error:", error);
  } else {
    console.log("✅ Email server ready");
  }
});

// ================= PAYMENT ROUTE =================
app.post("/paid", upload.single("screenshot"), async (req, res) => {

  console.log("📩 Payment request received");

  const userEmail = req.body.email;
  const screenshot = req.file;

  if (!userEmail || !screenshot) {
    return res.status(400).json({ message: "Email or screenshot missing" });
  }

  try {

    await transporter.sendMail({
      from: "notdhruv.fx@gmail.com",
      to: userEmail,
      subject: "✅ Your Purchase is Confirmed",
      html: `
        <h2>Thank you for your purchase 🎉</h2>
        <p>Your download link:</p>

        <a href="https://drive.google.com/drive/folders/1r1xMW1y89HyTCmvukf9btYjeHvWkVw4N?usp=sharing">
        👉 Download Product
        </a>

        <br><br>
        <p>Enjoy 🚀</p>
      `
    });

    console.log("✅ Email sent to:", userEmail);

    res.json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (error) {

    console.log("❌ FULL EMAIL ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }

});

// ================= START SERVER =================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
