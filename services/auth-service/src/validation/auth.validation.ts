import { z } from "zod";
import { nameSchema, emailSchema, passwordSchema } from "./common.validation";

export const registerSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema
});

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema
});

