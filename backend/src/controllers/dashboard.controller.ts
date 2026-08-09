import { Request, Response } from "express";
import User from "../models/User";
import BorrowerProfile from "../models/BorrowerProfile";
import LoanApplication from "../models/LoanApplication";
import Payment from "../models/Payment";
import { LOAN_STATUS, ALLOWED_TRANSITIONS, LoanStatus } from "../constants/loanStatus";

// --- SALES MODULE ---
export const getSalesLeads = async (req: Request, res: Response) => {
  try {
    // Find users with role "borrower"
    const borrowers = await User.find({ role: "borrower" }).select("-passwordHash");
    
    // Find all borrowers who have an active application
    const loans = await LoanApplication.find();
    const borrowersWithLoans = loans.map(l => l.borrower.toString());

    // Filter leads (borrowers without any loan applications)
    const leads = borrowers.filter(b => !borrowersWithLoans.includes(b.id.toString()));

    res.status(200).json({ success: true, data: leads });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --- SANCTION MODULE ---
export const getSanctionQueue = async (req: Request, res: Response) => {
  try {
    const queue = await LoanApplication.find({ status: LOAN_STATUS.APPLIED })
      .populate("borrower", "-passwordHash")
      .populate("borrowerProfile")
      .populate("salarySlipDocument");
    res.status(200).json({ success: true, data: queue });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const sanctionLoan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const loan = await LoanApplication.findById(id);

    if (!loan) {
      return res.status(404).json({ success: false, message: "Loan not found" });
    }

    if (!ALLOWED_TRANSITIONS[loan.status].includes(LOAN_STATUS.SANCTIONED)) {
      return res.status(400).json({ success: false, message: `Cannot transition from ${loan.status} to sanctioned` });
    }

    loan.status = LOAN_STATUS.SANCTIONED;
    loan.sanctionedBy = req.user?.id as any;
    loan.sanctionedAt = new Date();
    await loan.save();

    res.status(200).json({ success: true, data: loan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const rejectLoan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, message: "Rejection reason is required" });
    }

    const loan = await LoanApplication.findById(id);
    if (!loan) {
      return res.status(404).json({ success: false, message: "Loan not found" });
    }

    if (!ALLOWED_TRANSITIONS[loan.status].includes(LOAN_STATUS.REJECTED)) {
      return res.status(400).json({ success: false, message: `Cannot transition from ${loan.status} to rejected` });
    }

    loan.status = LOAN_STATUS.REJECTED;
    loan.rejectionReason = reason;
    await loan.save();

    res.status(200).json({ success: true, data: loan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --- DISBURSEMENT MODULE ---
export const getDisbursementQueue = async (req: Request, res: Response) => {
  try {
    const queue = await LoanApplication.find({ status: LOAN_STATUS.SANCTIONED })
      .populate("borrower", "-passwordHash")
      .populate("borrowerProfile")
      .populate("salarySlipDocument");
    res.status(200).json({ success: true, data: queue });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const disburseLoan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const loan = await LoanApplication.findById(id);

    if (!loan) {
      return res.status(404).json({ success: false, message: "Loan not found" });
    }

    if (!ALLOWED_TRANSITIONS[loan.status].includes(LOAN_STATUS.DISBURSED)) {
      return res.status(400).json({ success: false, message: `Cannot transition from ${loan.status} to disbursed` });
    }

    loan.status = LOAN_STATUS.DISBURSED;
    loan.disbursedBy = req.user?.id as any;
    loan.disbursedAt = new Date();
    await loan.save();

    res.status(200).json({ success: true, data: loan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --- COLLECTION MODULE ---
export const getActiveLoans = async (req: Request, res: Response) => {
  try {
    const activeLoans = await LoanApplication.find({ status: { $in: [LOAN_STATUS.DISBURSED, LOAN_STATUS.CLOSED] } })
      .populate("borrower", "-passwordHash")
      .populate("borrowerProfile");
    res.status(200).json({ success: true, data: activeLoans });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const recordPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { utrNumber, amount, date } = req.body;

    if (!utrNumber || !amount || !date) {
      return res.status(400).json({ success: false, message: "UTR Number, amount, and date are required" });
    }

    const loan = await LoanApplication.findById(id);
    if (!loan) {
      return res.status(404).json({ success: false, message: "Loan not found" });
    }

    if (loan.status !== LOAN_STATUS.DISBURSED) {
      return res.status(400).json({ success: false, message: "Can only record payments for disbursed loans" });
    }

    if (amount <= 0 || amount > loan.outstandingBalance) {
      return res.status(400).json({ success: false, message: `Amount must be > 0 and <= ${loan.outstandingBalance}` });
    }

    const existingPayment = await Payment.findOne({ utrNumber });
    if (existingPayment) {
      return res.status(400).json({ success: false, message: "UTR Number already exists. Duplicate payment detected." });
    }

    const payment = await Payment.create({
      loanApplication: loan._id,
      utrNumber,
      amount: Number(amount),
      paymentDate: new Date(date),
      recordedBy: req.user?.id,
    });

    loan.amountPaid += Number(amount);
    loan.outstandingBalance -= Number(amount);

    if (loan.outstandingBalance <= 0) {
      loan.status = LOAN_STATUS.CLOSED;
      loan.closedAt = new Date();
    }

    await loan.save();

    res.status(201).json({ success: true, data: { payment, loan } });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "UTR Number already exists." });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payments = await Payment.find({ loanApplication: id })
      .populate("recordedBy", "fullName email")
      .sort({ paymentDate: -1 });

    res.status(200).json({ success: true, data: payments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
