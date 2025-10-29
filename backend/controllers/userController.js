import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Note from "../models/notesModel.js";


const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            const error = new Error("Username, Email and Password are required");
            error.statusCode = 400;
            next(error);
            return;
        }

        const user = await User.findOne({ email });
        if (user) {
            const error = new Error("User with this email already exists");
            error.statusCode = 400;
            next(error);
            return;
        }

        const hashpassword = await bcrypt.hash(password, 10);
        console.log(hashpassword);


        const newUser = new User({ username, email, password: hashpassword, role: 'user' });
        await newUser.save();
        res.sendResponse(newUser, 201);
    }
    catch (error) {
        next(error);
    }

};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error("Email and Password are required");
            error.statusCode = 400;
            return next(error);
        }

        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error("Invalid credentials");
            error.statusCode = 401;
            return next(error);
        }

        const accessToken = jwt.sign(
            {
                id: user.id, email: user.email, username: user.username, role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.sendResponse({ message: "Login successful", accessToken }, 200);
    }
    catch (error) {
        next(error);
    }
};



const currentUser = async (req, res, next) => {
    try {
        const userId = req.user.id; // Assuming req.user is populated by authentication middleware
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }

        res.sendResponse({ id: req.user.id, email: req.user.email, username: req.user.username, role: req.user.role }, 200);
    } catch (error) {
        next(error);
    }
};
 
const getAllUsersNotes = async (req, res, next) => {
    try {
        const users = await User.find();
        const usersWithNotes = [];

        for (const user of users) {
            const notes = await Note.find({ user_id: user.id }).sort({ createdAt: -1 });
            usersWithNotes.push({ user, notes });
        }

        res.sendResponse(usersWithNotes, 200);
    } catch (error) {
        next(error);
    }
};

export { signup, login, currentUser, getAllUsersNotes };