import {NextFunction, Request, Response} from 'express';
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { registerSchema } from '../validation/auth.validation';
import { HTTPSTATUS } from '../config/http.config';
import { registerService } from '../services/auth.service';
import passport from 'passport';

// OAuth
export const googleLoginCallback = asyncHandler(
    async(req: Request, res: Response) => {
    // const currentOrganization = req.user?.currentOrganization;

    // if (currentOrganization){
    //     return res.redirect(
    //         `${config.FRONTEND_ORIGIN}/organization/${currentOrganization}`
    //     )
    // }
    // return res.redirect(
    //     `${config.FRONTEND_ORIGIN}/organization/_`
    // )
    return res.status(HTTPSTATUS.OK).json("Login via Google successfully.")
})

// register new local user
export const registerController = asyncHandler
(async(req: Request, res: Response) => {
    const body = registerSchema.parse({
        ...req.body,
    });
    await registerService(body);
    return res.status(HTTPSTATUS.CREATED).json({
        message: "User created successfully.",
    })
})
//local login
export const loginController = asyncHandler(
(async(req: Request, res: Response, next: NextFunction) => {
   passport.authenticate("local", (
    err: Error | null, 
    user: Express.User | false,
    info: {message: string} | undefined,
    ) => {
        if (err) {
            return next(err);
        }
        if(!user){
            return res.status(HTTPSTATUS.UNAUTHORIZED).json({
                message: info?.message || "Invalid email or password."
            })
        }
        req.logIn(user, (err) => {
            if(err){
                return next(err);
            }
            
            return res.status(HTTPSTATUS.OK).json({
                message: "Logged in successfully.",
                user,
            });
        });
    })(req, res, next)
})
)
//logout
export const logoutController = asyncHandler(
    async(req: Request, res: Response) => {
    req.logOut((err) => {
        if (err){
            console.log("logout failed:" + err.message);
            return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
            .json({error:"Cannot logout, please try again later."})
        };

        req.session.destroy((err) => {
            if(err){
                console.log('Session destruction failed:', err);
                return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
                .json({error:"Cannot complete logout, please try again later."})
            }
            res.clearCookie('connect.sid'); //test clear cookies
            return res.status(HTTPSTATUS.OK).json("logout successfully.")
        });
        
    })
})
// get current user profile