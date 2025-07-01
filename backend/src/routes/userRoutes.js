import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
    res.send ("Welcome to the Expense Tracker ")
})

router.get("/novel", (req, res) => {
    res.send("This is a novel endpoint TBATE")
})

export default router; //Mount routes at this base path