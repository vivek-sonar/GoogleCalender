import express from "express";
import connectDB from "./src/db/connection.js";
import eventRoutes from "./src/route/eventRoutes.js";
import schedulerouter from "./src/route/ScheduleRoutes.js";
import noticeRoutes from "./src/route/noticeRoutes.js";


const app = express();
app.use(express.json());

app.use(eventRoutes);
app.use("/schedules",schedulerouter);
app.use("/notices", noticeRoutes);
connectDB()

app.listen(5000,() => {
    console.log("Server started at 5000 ");
})