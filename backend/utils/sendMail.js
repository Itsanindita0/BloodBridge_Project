// backend/utils/sendMail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // load EMAIL_USER & EMAIL_PASS

export const sendMail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"BloodBridge Alerts 🩸" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: message,
    });

    console.log("📩 Email sent successfully to:", to);
    return true;
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    return false;
  }
};
