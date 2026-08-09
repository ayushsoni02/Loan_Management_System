import { Request, Response } from "express";
import LoanApplication from "../models/LoanApplication";
import BorrowerProfile from "../models/BorrowerProfile";
import Document from "../models/Document";
import { calculateLoanMath } from "../services/loanMath.service";
import { LOAN_STATUS } from "../constants/loanStatus";

export const applyForLoan = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { principal, tenureDays, documentData } = req.body;

    if (!principal || !tenureDays || !documentData) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const profile = await BorrowerProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Borrower profile not found" });
    }

    if (profile.breStatus !== "passed") {
      return res.status(400).json({ success: false, message: "Borrower profile failed eligibility check" });
    }

    const math = calculateLoanMath(Number(principal), Number(tenureDays));

    const loanApplication = new LoanApplication({
      borrower: userId,
      borrowerProfile: profile._id,
      principal: Number(principal),
      tenureDays: Number(tenureDays),
      interestRate: 12,
      simpleInterest: math.simpleInterest,
      totalRepayment: math.totalRepayment,
      status: LOAN_STATUS.APPLIED,
      outstandingBalance: math.totalRepayment,
    });

    await loanApplication.save();

    // Save document details
    const salarySlip = await Document.create({
      loanApplication: loanApplication._id,
      fileName: documentData.fileName,
      filePath: documentData.filePath,
      mimeType: documentData.mimeType,
      sizeBytes: documentData.sizeBytes,
    });

    loanApplication.salarySlipDocument = salarySlip._id as any;
    await loanApplication.save();

    res.status(201).json({ success: true, data: loanApplication });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const getMyLoans = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const loans = await LoanApplication.find({ borrower: userId })
      .populate("borrowerProfile")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: loans });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};
