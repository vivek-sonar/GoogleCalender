


import mongoose from "mongoose";

const connectDB  = async () => {
    try {
        const conn  = await mongoose.connect("mongodb://localhost:27017/Events");
        console.log("connected successfully with :", conn.connection.name);
    } catch (error) {
        console.log("error in connection to Database", error);
    }
};

export default connectDB ;