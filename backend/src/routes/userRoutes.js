import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/user.Controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  validateRegister,
  validateAddTransaction,
  validateUpdateTransaction,
  handleValidationErrors,
} from "../middlewares/validation.middleware.js";
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
} from "../controllers/transaction.controller.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Expense Tracker ");
});

router.get("/novel", (req, res) => {
  res.send("This is a novel endpoint TBATE");
});

router.get("/character", (req, res) => {
  res.send("Arthur Leywin is the main character of TBATE");
});

router.post(
  "/register",
  authLimiter, // Applies rate limiting to the registration route
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  validateRegister,
  handleValidationErrors,
  registerUser
);

router.post("/login", authLimiter, loginUser);

//secured routes, user should be logged in to access this

router.post(
  "/add-transaction",
  verifyJWT,
  validateAddTransaction,
  handleValidationErrors,
  addTransaction
);

router.get("/all-transactions", verifyJWT, getTransactions);

router.put(
  "/update-transaction/:id",
  verifyJWT,
  validateUpdateTransaction,
  handleValidationErrors,
  updateTransaction
);

router.delete("/delete-transaction/:id", verifyJWT, deleteTransaction);

router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);

export default router;
