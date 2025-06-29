import mongoose from "mongoose";
import UserModel from "../models/user.model";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../utils/appError";
import accountModel from "../models/account.model";

export const getCurrentUserService = async(userId: string) => {
    const user = await UserModel.findById(userId)
        .select("-password");
    if(!user){
        throw new BadRequestException("User not found.");
    }
    return {user}
}

export const getUserProfileByIdService = async(userId: string, profileId: string) => {
    // Check if the requester is trying to access their own profile or has permission
    if (userId !== profileId) {
        // In a real app, check if user has admin permission
        // For simplicity, everyone can access everyone profile.
    }

    const user = await UserModel.findById(profileId)
        .select("-password");

    if(!user){
        throw new NotFoundException("User profile not found.");
    }
    
    return {userProfile: user};
}

export const updateCurrentProfileService = async (userId: string, updateData: {
     name?: string;
    profilePicture?: string | null;
}) => {
    const user = await UserModel.findById(userId);
    if(!user){
        throw new NotFoundException("User not found.");
    }

    // Update the fields
    if(updateData.name) user.name = updateData.name;
    if(updateData.profilePicture) user.profilePicture = updateData.profilePicture;

    await user.save();
    return user.omitPassword();
};


export const deleteUserProfileService = async(userId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        // Find and validate user
        const user = await UserModel.findById(userId).session(session);
        if(!user){
            throw new NotFoundException("User not found.");
        }
        
        // Delete associated data
        await accountModel.deleteMany({ userId }).session(session);
        
        // Delete the user
        await user.deleteOne({ session });
        
        await session.commitTransaction();
        
        return { message: "User profile deleted successfully" };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}