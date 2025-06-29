import { Request,Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { 
    getCurrentUserService, 
    getUserProfileByIdService,
    updateCurrentProfileService,
    deleteUserProfileService
} from "../services/user.service";
import { objectIdSchema } from "../validation/common.validation";
import { updateUserSchema } from "../validation/user.validation";
import { BadRequestException } from "../utils/appError";

export const getCurrentUserController = asyncHandler(
    async(req: Request, res: Response) => {
        const userId = (String)(req.user?._id);
        const {user} = await getCurrentUserService(userId);

        return res.status(HTTPSTATUS.OK).json({
            message: "User fetched successfully.",
            user,
        });
    }
);

export const getUserProfileByIdController = asyncHandler(
    async(req: Request, res: Response) => {
        const userId = String(req.user?._id);
        const profileId = String(req.params.id);
        
        const {userProfile} = await getUserProfileByIdService(userId, profileId);

        return res.status(HTTPSTATUS.OK).json({
            message: "User profile fetched successfully.",
            userProfile,
        });
    }
);

export const updateCurrentProfileController = asyncHandler(
    async(req: Request, res: Response) => {
        const userId = (String)(req.user?._id);
        const updateData = updateUserSchema.parse(req.body);
        
        const updatedProfile = await updateCurrentProfileService(userId, updateData);

        return res.status(HTTPSTATUS.OK).json({
            message: "Profile updated successfully.",
            user: updatedProfile,
        });
    }
);

export const deleteUserProfileController = asyncHandler(
    async(req: Request, res: Response) => {
        const userId = (String)(req.user?._id);
        
        // For safety, require confirmation in the request body
        if (!req.body.confirmation || req.body.confirmation !== "DELETE MY ACCOUNT") {
            throw new BadRequestException(
                "Please confirm account deletion by including 'confirmation: DELETE_MY_ACCOUNT' in the request body."
            );
        }
        
        await deleteUserProfileService(userId);

        // Clear session
        req.logout((err) => {
            if (err) {
                console.error("Error during logout after account deletion:", err);
            }
        });

        return res.status(HTTPSTATUS.OK).json({
            message: "Your account has been permanently deleted.",
        });
    }
);