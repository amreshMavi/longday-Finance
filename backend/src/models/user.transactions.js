import mongoose from "mongoose";

const userTransactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        description: {
            type: String,
            trim: true,
            required: [true, "Description is required"]
        },

        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0, "Amount must be positive"]
        },

        type: {
            type: String,
            required: [true, "Transaction type is required"],
            enum: {
                values: ["income", "expense"],
                message: "Transaction type must be either 'income' or 'expense'"
            },
            lowercase: true
        },

        // Category of transaction eg: groceries, transport, trip etc.

        category: {
            type: String,
            trim: true,
            required: [true, "Category is required"],
            minlength: [3, "Category must be at least 3 characters long"]
        },
        // Date of transactions
        transactionDate: {
            type: Date,
            default: Date.now,
            // required: [true, "Transaction date is required"]
        },
    },
    {
        timestamps: true
    }
);

export const UserTransaction = mongoose.model("UserTransaction", userTransactionSchema);