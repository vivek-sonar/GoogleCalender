import express from "express";
import connectDB from "./src/db/connection.js";
import eventRoutes from "./src/route/eventRoutes.js";
import schedulerouter from "./src/route/ScheduleRoutes.js";
import noticeRoutes from "./src/route/noticeRoutes.js";
import cors from "cors";
import bodyParser from "body-parser";
import msgrouter from "./src/route/messageRoutes.js";
import authRoutes from "./src/route/authRoutes.js";
import http from "http"; 
import { Server } from "socket.io";


const app = express();

const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "*", // adjust to match frontend origin if needed
    methods: ["GET", "POST"],
  },
});
app.set('io', io); // Add this line

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("sendMessage", (data) => {
    console.log("Received msg:", data);
    socket.broadcast.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));


app.use(eventRoutes);
app.use("/schedules",schedulerouter);
app.use("/notices", noticeRoutes);
app.use("/messages", msgrouter);
app.use('/auth', authRoutes);


connectDB()
// start express API
server.listen(5000,() => {
    console.log("Server started at 5000 ");
})