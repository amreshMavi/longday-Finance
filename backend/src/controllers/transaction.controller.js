import { UserTransaction } from "../models/user.transactions.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// responsible for implementing the business logic for all operations related to financial transactions

// Handles the creation of a new financial transaction for the authenticated user.
const addTransaction = async (req, res, _) => {
    const { description, amount, type, transactionDate, category } = req.body
    const userId = req.user.userId || req.user._id; // Extract userId from the request object, which is set by the verifyJWT middleware
    console.log(userId)

    console.log("Extracted transactionDate:", transactionDate);

    if (!userId) {
        throw new ApiError(401, "User not authenticated")
    }

    try {
        if (
            !description?.trim() ||
            !amount ||
            !type?.trim() ||
            !category?.trim()
        ) {
            throw new ApiError(400, "All fields are required!")
        }

        const newTransaction = new UserTransaction({
            userId,
            description,
            amount,
            type,
            // transactionDate: new Date(transactionDate),
            category
        })

        console.log(transactionDate, "transactionDate")

        const Transaction = new UserTransaction(newTransaction);
 
        await Transaction.save()

        return res.status(201).json(
            new ApiResponse(200, Transaction, "Transaction created successfully")
        )
    } catch (error) {
        throw new ApiError(500, error?.message || "Transaction creation failed")
    }
}

// Retrieves a list of all financial transactions belonging to the authenticated user. 
const getTransactions = async (req, res, _) => {
    
    try {
        const query  = {userId: req.user._id}

        // Apply filters based on query parameters
        if (req.query.type)  {
            query.type = req.query.type
        }

        if (req.query.category) {
            query.category = req.query.category
        }

        if (req.query.startDate && req.query.endDate) {
            query.transactionDate = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            }
        }

        const { sortBy, sortOrder } = req.query

        let sortOptions = { transactionDate: -1 } //  If no sort is specified by the user, sort by transactionDate in descending order (latest first)

        if (sortBy && sortOrder) {
            const order = sortOrder === "desc" ? -1 : 1;
            sortOptions = { [sortBy]: order}
        }

        const transactions = await UserTransaction
        .find(query)
        .sort(sortOptions)

        res.status(200).json(
            new ApiResponse(200, transactions, "Transactions retrieved successfully")
        )
    } catch (error) {
        res.status(500).json({
            error: error.message || "Failed to retrieve transactions"
        })
    }

}

const updateTransaction = async (req, res, _) => {

    try {
        const updateTransaction = await UserTransaction.findOneAndUpdate(
            {
                // The transaction ID — passed in the URL like /transactions/:id. Used to identify which transaction to update.
                _id: req.params.id,
                userId: req.user._id
            },
            req.body,
            { new: true, runValidators: true }
            // Returns updated doc instead of old one, Ensures amount, type, etc., are valid
        );

        if (!updateTransaction){
            return res.status(404).json({
                message: "Transaction not found or you are not authorized to update it"
            })
        }

        return res.status(200).json(
            new ApiResponse(200, updateTransaction, "Transaction updated successfully")
        )
    } catch (error) {
        return res.status(500).json({
            error: error.message || "Failed to update transaction"
        })
    }
};

const deleteTransaction = async (req, res, _) => {
    
    try {
        const deleteTransaction = await UserTransaction.findOneAndDelete(
            {
                _id: req.params.id,
                userId: req.user._id
            },
        );

        if (!deleteTransaction){
            return res.status(404).json({
                message: "Transaction not found or you are not authorized to delete it"
            })
        }

        return res.status(200).json(
            new ApiResponse(200, deleteTransaction, "Transaction deleted successfully")
        )

    } catch (error) {
        return res.status(500).json({
            error: error.message || "Failed to delete transaction"
        })
    }

}

export { addTransaction, getTransactions, updateTransaction, deleteTransaction}