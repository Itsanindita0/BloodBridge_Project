import express from "express";
import Donor from "../models/Donor.js";
import auth from "../middleware/auth.js"; // protect routes

const router = express.Router();

/* -----------------------------------------------------
   ADD A DONATION  (logged in user only)
----------------------------------------------------- */
router.post("/", auth, async (req, res) => {
  try {
    const donor = await Donor.create({
      ...req.body,
      userId: req.user.id
    });

    res.json({ success: true, donor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/* -----------------------------------------------------
   LIST DONATIONS OF THE LOGGED-IN USER
----------------------------------------------------- */
router.get("/", auth, async (req, res) => {
  try {
    const donors = await Donor.find({ userId: req.user.id });
    res.json(donors);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* -----------------------------------------------------
   LIST ALL DONORS (OPTIONAL — PUBLIC)
   use this later for search UI 
   route will be /api/donors/all
----------------------------------------------------- */
router.get("/all", async (req, res) => {
  try {
    const donors = await Donor.find();
    res.json(donors);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* -----------------------------------------------------
   DELETE A DONATION — only owner can delete
----------------------------------------------------- */
router.delete("/:donorId", auth, async (req, res) => {
  try {
    const deleted = await Donor.findOneAndDelete({
      _id: req.params.donorId,
      userId: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Not authorized or donation not found"
      });
    }

    res.json({ success: true, message: "Donation removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
