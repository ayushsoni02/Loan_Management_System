import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { ROLES } from "../constants/roles";
import {
  getSalesLeads,
  getSanctionQueue,
  sanctionLoan,
  rejectLoan,
  getDisbursementQueue,
  disburseLoan,
  getActiveLoans,
  recordPayment,
  getPayments
} from "../controllers/dashboard.controller";

const router = Router();

router.use(authenticate);

// Sales Module
router.get("/sales/leads", authorize(ROLES.SALES, ROLES.ADMIN), getSalesLeads);

// Sanction Module
router.get("/sanction/applications", authorize(ROLES.SANCTION, ROLES.ADMIN), getSanctionQueue);
router.post("/loans/:id/sanction", authorize(ROLES.SANCTION, ROLES.ADMIN), sanctionLoan);
router.post("/loans/:id/reject", authorize(ROLES.SANCTION, ROLES.ADMIN), rejectLoan);

// Disbursement Module
router.get("/disbursement/queue", authorize(ROLES.DISBURSEMENT, ROLES.ADMIN), getDisbursementQueue);
router.post("/loans/:id/disburse", authorize(ROLES.DISBURSEMENT, ROLES.ADMIN), disburseLoan);

// Collection Module
router.get("/collection/active-loans", authorize(ROLES.COLLECTION, ROLES.ADMIN), getActiveLoans);
router.post("/loans/:id/payments", authorize(ROLES.COLLECTION, ROLES.ADMIN), recordPayment);
router.get("/loans/:id/payments", authorize(ROLES.COLLECTION, ROLES.ADMIN, ROLES.BORROWER), getPayments);

export default router;
