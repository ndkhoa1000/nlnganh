import "dotenv/config"
import mongoose from "mongoose";
import UserModel from "../models/user.model";
import accountModel from "../models/account.model";
import { NotFoundException, UnauthorizedException } from "../utils/appError";
import { ProviderEnum } from "../enums/account-provider.enums";

export const loginOrCreateAccountService = async (data:{
    provider: string,
    displayName: string,
    providerId: string,
    picture?: string,
    email?: string,
    }) => {
        const {provider,displayName,providerId,picture,email} = data;
        
        // create an account -> create user -> create account (ref: user)

        const session = await mongoose.startSession();
        console.log('start Session...')
        try {
            session.startTransaction();
            // check if user exist
            let user = await UserModel.findOne({email}).session(session);

            if (!user) {
                user = new UserModel({
                    email,
                    name: displayName,
                    profilePicture: picture || null,
                    // random pwd to pass userModel validation for Oath user
                    password: `oauth-${Math.random().toString(36).substring(2)}` 
                });
                await user.save({session});
                
                const account = new accountModel({
                    userId: user._id,
                    provider: provider,
                    providerId: providerId,
                });
                await account.save({session});
                
                await session.commitTransaction();
                console.log('commit transaction...');
                session.endSession();
                console.log('session end. Finish.');
            }
            return {user};
        } catch (error) {
            console.log("Error during session...", error)
            await session.abortTransaction()
            session.endSession();
            throw error;
        } finally {
            session.endSession();
        }
    };

//register new local user
export const registerService = async (body: {
    email: string,
    name: string,
    password: string,
}) => {
    const { email, name, password} = body;
    const session = await mongoose.startSession();
        console.log('start Session...')
        try {
            session.startTransaction();
            // check if user exist
            let user = await UserModel.findOne({email}).session(session);

            if (!user) {
                user = new UserModel({
                    email,
                    name,
                    password
                });
            }
            await user.save({session});

            const account = new accountModel({
                userId: user._id,
                provider: ProviderEnum.EMAIL,
                providerId: email,
            });
            await account.save({session});

            await session.commitTransaction();
            console.log('commit transaction...');
            session.endSession();
            console.log('session end. Finish.');

            return { user };
        } catch (error) {
            console.log("Error during session...", error)
            await session.abortTransaction()
            session.endSession();
            throw error;
        } finally {
            session.endSession();
        }
}

export const verifyUserService = async({
    email,
    password,
    provider= ProviderEnum.EMAIL,
}:{
    email: string;
    password: string;
    provider?: string;
}) => {
    const account = await accountModel.findOne({provider, providerId:email});
    if(!account){
        throw new NotFoundException("Invalid email or password");
    };

    const user = await UserModel.findById(account.userId);
    if(!user){
        throw new NotFoundException("User not found for giving account");
    }

    const PasswordIsMatch = await user.comparePassword(password);
    
    if(!PasswordIsMatch){
        throw new UnauthorizedException("Invalid email or password");
    };
    return user.omitPassword();
}
