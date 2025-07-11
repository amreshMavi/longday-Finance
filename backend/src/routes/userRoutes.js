import express from "express";
import { registerUser, loginUser } from "../controllers/user.Controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

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
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.post("/login", loginUser);

export default router;
