import express from "express";
import connectDB from "./src/db/connection.js";
import eventRoutes from "./src/route/eventRoutes.js";
import schedulerouter from "./src/route/ScheduleRoutes.js";
import noticeRoutes from "./src/route/noticeRoutes.js";
import cors from "cors";
import bodyParser from "body-parser";


const app = express();
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));


app.use(eventRoutes);
app.use("/schedules",schedulerouter);
app.use("/notices", noticeRoutes);
connectDB()

app.listen(5000,() => {
    console.log("Server started at 5000 ");
})