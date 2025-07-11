import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 3000;

dotenv.config({
  path: "./env", // giving directory to access .env variables
});

await connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB connection failed! ${error}`);
  });
