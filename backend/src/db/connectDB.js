import mongoose, { mongo } from 'mongoose';
import { DB_NAME } from '../constants.js';
import express from 'express';

const app = express();

// const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_tracker';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connection successfull !!`)
    } catch (error) {
        console.log("MONGODB connection error", error)
        process.exit(1)
    }
}

export default connectDB;