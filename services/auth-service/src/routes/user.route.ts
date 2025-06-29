import { Router } from "express";
import { 
    getCurrentUserController, 
    getUserProfileByIdController,
    updateCurrentProfileController,
    deleteUserProfileController
} from "../controllers/user.controller";

const userRoutes = Router();

// Get current user
userRoutes.get("/current", getCurrentUserController);

// Get user profile by ID
userRoutes.get("/profile/:id", getUserProfileByIdController);

// Update current user profile
userRoutes.put("/profile/update", updateCurrentProfileController);

// Delete user account
userRoutes.delete("/profile/delete", deleteUserProfileController);

export default userRoutes;