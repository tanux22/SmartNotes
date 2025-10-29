import express from "express";
import { currentUser, getAllUsersNotes, login, signup } from "../controllers/userController.js";
import validateToken from "../middlewares/authMiddleware.js";
import validateRole from "../middlewares/roleMiddleware.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);

userRouter.post("/login", login);

userRouter.post("/current", validateToken, currentUser);

userRouter.get("/admin/users-notes", validateToken, validateRole, getAllUsersNotes);

export default userRouter;