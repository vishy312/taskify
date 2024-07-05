import { connectDB } from "./db/index.js";
import app from "./app.js";
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})

connectDB()
.then(() => {
    const port = process.env.PORT || "8080";

    app.on('error', () => {
        console.log("An error occured while running the app");
        throw err;
    })
    app.listen(port, () => {
        console.log(`server is connected on port ${port}`);
    })
})
.catch((error) => {
    console.log("MongoDB connection failed!!!");
})




