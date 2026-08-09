import { Router } from "express";
import { submitProfile, uploadDocument, getProfile } from "../controllers/borrower.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { ROLES } from "../constants/roles";
import { upload } from "../middleware/upload";

const router = Router();

// Apply auth to all routes in this file
router.use(authenticate);
router.use(authorize(ROLES.BORROWER));

router.get("/profile", getProfile);
router.post("/profile", submitProfile);
router.post("/documents", upload.single("salarySlip"), uploadDocument);

export default router;
