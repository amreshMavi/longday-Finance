import express from 'express';
import registerUser from '../controllers/user.Controllers.js';

const router = express.Router();

router.get("/", (req, res) => {
    res.send ("Welcome to the Expense Tracker ")
})

router.get("/novel", (req, res) => {
    res.send("This is a novel endpoint TBATE")
})

router.get("/character", (req, res) => {
    res.send("Arthur Leywin is the main character of TBATE")
})

router.post("/register", registerUser);

export default router; 