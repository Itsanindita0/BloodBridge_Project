// backend/utils/sendMail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // load EMAIL_USER & EMAIL_PASS

export const sendMail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
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
    return { success: true };
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    return { success: false, error: error.message };
  }
};
