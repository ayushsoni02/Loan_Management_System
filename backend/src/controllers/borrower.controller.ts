import { Request, Response } from "express";
import BorrowerProfile from "../models/BorrowerProfile";
import Document from "../models/Document";
import { runBRE } from "../services/bre.service";

export const submitProfile = async (req: Request, res: Response) => {
  try {
    const { fullName, pan, dob, monthlySalary, employmentMode } = req.body;
    const userId = req.user?.id;

    if (!fullName || !pan || !dob || !monthlySalary || !employmentMode) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Calculate age
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Run BRE
    const breResult = runBRE({
      age,
      monthlySalary: Number(monthlySalary),
      pan,
      employmentMode,
    });

    let profile = await BorrowerProfile.findOne({ user: userId });

    if (profile) {
      profile.fullName = fullName;
      profile.pan = pan.toUpperCase();
      profile.dob = birthDate;
      profile.monthlySalary = Number(monthlySalary);
      profile.employmentMode = employmentMode;
      profile.breStatus = breResult.status;
      profile.breFailReasons = breResult.reasons;
      await profile.save();
    } else {
      profile = await BorrowerProfile.create({
        user: userId,
        fullName,
        pan: pan.toUpperCase(),
        dob: birthDate,
        monthlySalary: Number(monthlySalary),
        employmentMode,
        breStatus: breResult.status,
        breFailReasons: breResult.reasons,
      });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Return document details temporarily to be attached to loan application later
    // or just return the file details to the client
    const docInfo = {
      fileName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
    };

    res.status(201).json({ success: true, data: docInfo });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await BorrowerProfile.findOne({ user: req.user?.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};
