import express from "express";
import Receiver from "../models/Receiver.js";
import Donor from "../models/Donor.js";
import auth from "../middleware/auth.js";
import { sendMail } from "../utils/sendMail.js";
import User from "../models/User.js";

const router = express.Router();

/* -----------------------------------------------------
   CREATE BLOOD REQUEST (logged-in user only)
----------------------------------------------------- */
router.post("/", auth, async (req, res) => {
  try {
    const receiver = await Receiver.create({ ...req.body, userId: req.user.id });
    res.json({ success: true, receiver });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/* -----------------------------------------------------
   LIST CURRENT USER’S REQUESTS
----------------------------------------------------- */
router.get("/", auth, async (req, res) => {
  try {
    const receivers = await Receiver.find({ userId: req.user.id });
    res.json(receivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* -----------------------------------------------------
   LIST ALL REQUESTS (public — homepage & requests page)
----------------------------------------------------- */
router.get("/all", async (req, res) => {
  try {
    const receivers = await Receiver.find();
    res.json(receivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* -----------------------------------------------------
   FIND MATCHING DONORS FOR ONE REQUEST
----------------------------------------------------- */
router.get("/match/:receiverId", async (req, res) => {
  try {
    const receiver = await Receiver.findById(req.params.receiverId);
    if (!receiver) return res.status(404).json({ message: "Receiver not found" });

    const matchingDonors = await Donor.find({
      bloodGroup: receiver.bloodGroupNeeded,
      city: receiver.city,
    });

    res.json({ receiver, matchingDonors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* -----------------------------------------------------
   MARK REQUEST AS FULFILLED (only owner)
----------------------------------------------------- */
router.patch("/:receiverId/fulfill", auth, async (req, res) => {
  try {
    const receiver = await Receiver.findOneAndUpdate(
      { _id: req.params.receiverId, userId: req.user.id },
      { status: "fulfilled" },
      { new: true }
    );

    if (!receiver)
      return res.status(404).json({ message: "Not authorized or request not found" });

    res.json({ success: true, receiver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* -----------------------------------------------------
   DELETE REQUEST (only owner)
----------------------------------------------------- */
router.delete("/:receiverId", auth, async (req, res) => {
  try {
    const deleted = await Receiver.findOneAndDelete({
      _id: req.params.receiverId,
      userId: req.user.id,
    });

    if (!deleted)
      return res.status(404).json({ message: "Not authorized or request not found" });

    res.json({ success: true, message: "Request deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* -----------------------------------------------------
   🚨 NOTIFY RECEIVER WHEN A DONOR WANTS TO DONATE
   (logged-in donor clicks Donate button)
----------------------------------------------------- */
router.post("/:receiverId/notify", auth, async (req, res) => {
  try {
    const receiver = await Receiver.findById(req.params.receiverId);

    if (!receiver)
      return res.status(404).json({ success: false, message: "Receiver not found" });

    // logged-in donor
    const donor = await User.findById(req.user.id);

    if (!donor)
      return res.status(404).json({ success: false, message: "Donor not found" });

    // must have receiver email
    if (!receiver.email)
      return res.status(400).json({ success: false, message: "Receiver email missing in request" });

    const emailBody = `
      <h2>🚨 Blood Donation Update</h2>
      <p>Hello <strong>${receiver.name}</strong>,</p>
      <p><strong>${donor.name}</strong> is ready to donate blood for your request.</p>
      <p>🩸 <strong>Blood Needed:</strong> ${receiver.bloodGroupNeeded}</p>
      <p>📍 <strong>City:</strong> ${receiver.city}</p>
      <p>📞 <strong>Donor Contact:</strong> ${donor.phone || "Not provided"}</p>
      <br>
      <p>❤️ Stay strong,<br>BloodBridge Team</p>
    `;

    const mailSent = await sendMail(receiver.email, "A donor is ready to help 🩸", emailBody);

    if (!mailSent)
      return res.status(500).json({ success: false, message: "Failed to send email" });

    res.json({ success: true, message: "Receiver notified successfully!" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
