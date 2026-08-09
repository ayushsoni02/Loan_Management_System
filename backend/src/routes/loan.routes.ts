import { Router } from "express";
import { applyForLoan, getMyLoans } from "../controllers/loan.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { ROLES } from "../constants/roles";

const router = Router();

// Apply auth to all routes in this file
router.use(authenticate);
router.use(authorize(ROLES.BORROWER));

router.post("/apply", applyForLoan);
router.get("/my", getMyLoans);

export default router;
