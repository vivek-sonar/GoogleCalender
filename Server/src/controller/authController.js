import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/userSchema.js';
import Message from "../model/MessageSchema.js";


// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, userRole,messageId } = req.body;

    // Validate required fields
    if (!email || !password || !userRole) {
      return res.status(400).json({ error: 'Email, password, and userRole are required' });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }


    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userRole,
      registeredVia: 'email',
      status: 'approved', // For testing; adjust based on your app logic
      messageId// Assign message ID
    });

    const savedUser = await newUser.save();


    // Update the message with the user's _id as senderId
    await Message.updateOne(
      { messageId},
      { senderId: savedUser._id }
    );
    res.status(201).json({
      message: 'User registered successfully',
      data: req.body
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, userRole: user.userRole },
      'asdf@123', // Replace with your secret
      { expiresIn: '8h' }
    );

    res.status(200).json({
      message: 'Login successful',
      data: {
        token,
        user
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};






// Get all users with their sent and received messages
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .lean();

    // Fetch messages for each user (sent or received)
    const usersWithMessages = await Promise.all(
      users.map(async (user) => {
        const messages = await Message.find({
          $or: [
            { senderId: user._id },
            { recipientId: user._id }
          ]
        }).populate("senderId", "name email")
          .populate("recipientId", "name email");

        return {
          ...user,
          messages,
        };
      })
    );

    res.status(200).json(usersWithMessages);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};













// Get a single user by ID and populate messages
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: user._id },
        { recipientId: user._id }
      ]
    }).populate("senderId", "name email")
      .populate("recipientId", "name email");

    res.status(200).json({
      ...user,
      messages
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
