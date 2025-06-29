import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/appError";
import { ErrorCodeEnum } from "../enums/error-code.enums";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if(!req.user || !req.user._id){
        throw new UnauthorizedException("Unauthorized. Please log in!", ErrorCodeEnum.ACCESS_UNAUTHORIZED);
    }
    next();
}
