import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import donorRoutes from "./routes/donorRoutes.js";
import receiverRoutes from "./routes/receiverRoutes.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// connect database
connectDB();

// API routes
app.use("/api/auth", authRoutes);

app.use("/api/donors", donorRoutes);
app.use("/api/receivers", receiverRoutes);

// Test Route for Email Debugging
import { sendMail } from "./utils/sendMail.js";
app.get("/api/test-email", async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Please provide ?email=your_email" });

  const result = await sendMail(email, "Test Email from BloodBridge", "<p>This is a test email to verify configuration.</p>");
  res.json(result);
});

app.get("/", (req, res) => {
  res.send("❤️ BloodBridge Backend Running...");
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
