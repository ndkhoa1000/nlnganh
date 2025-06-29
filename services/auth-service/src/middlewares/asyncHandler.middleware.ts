import {NextFunction, Request, Response} from 'express';

type asyncControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

export const asyncHandler = (controller: asyncControllerType): asyncControllerType =>
    async(req, res, next) => {
        try{
            await controller(req, res, next);
        }catch(error){
            next(error);
        }
    };