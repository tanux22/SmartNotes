import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();


const createAdminUser = async () => {
    try {

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error("Admin email or password not set.");
            return;
        }

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("Admin user already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const adminUser = new User({
            username: "admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin"
        });

        await adminUser.save();
        console.log("Admin user created successfully.");
    } catch (error) {
        next(error);
    }
};

export default createAdminUser;