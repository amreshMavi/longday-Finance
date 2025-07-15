import { UserTransaction } from "../models/user.transactions";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

// responsible for implementing the business logic for all operations related to financial transactions

// Handles the creation of a new financial transaction for the authenticated user.
const addTransacion = async (req, res, next) => {
    const { description, amount, type, transactionDate, category } = req.body
    const { userId } = req.user

    if (!userId) {
        throw new ApiError(401, "User not authenticated")
    }

    try {
        if ([description, amount, type, transactionDate, category].some((field) => field.trim() === "")) {
            throw new ApiError(400, "All fields are required!")
        }

        const newTransaction = new UserTransaction({
            userId,
            description,
            amount,
            type,
            transactionDate: new Date(transactionDate),
            category
        })

        const saveTransaction = await newTransaction.save()

        const createdTransaction = await UserTransaction.findById(newTransaction._id)

        if (!createdTransaction) {
            throw new ApiError(500, "Transaction creation failed")
        }

        return res.status(201).json(
            new ApiResponse(200, createdTransaction, "Transaction created successfully")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Transaction creation failed")
    }
}