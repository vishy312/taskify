import mongoose from "mongoose"
import { DB_NAME } from "../constants.js";


export const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI + "/" + DB_NAME);
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log("Connected to Mongo Successfully", connectionInstance.connection.host);
        return
    } catch (error) {
        console.log("Something went wrong while mongodb connection ===>" + process.env.MONGO_URI);
        process.exit(1);
    }
}