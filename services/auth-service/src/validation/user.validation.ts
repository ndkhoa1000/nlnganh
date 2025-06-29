import { z } from "zod";
import { 
    nameSchema, 
    urlSchema 
} from "./common.validation";

export const updateUserSchema = z.object({
    name: nameSchema.optional(),
    profilePicture: urlSchema.optional(),
}).partial();
