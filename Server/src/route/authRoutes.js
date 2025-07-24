import express from "express";
// import User from "../model/userSchema.js";
import {register, login, getAllUsers, getUserById} from "../controller/authController.js";



const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.get('/getallusers', getAllUsers);
authRoutes.get('/getuser/:id', getUserById);
// authRoutes.get("/", async (req, res) => {
//   const users = await User.find({}, "_id name email"); // return only needed fields
//   res.json(users);
// });

export default authRoutes;
