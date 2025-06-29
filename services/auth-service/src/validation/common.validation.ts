import { z } from "zod";

// Common string fields
export const nameSchema = z.string().trim().min(1, { message: "Name is required" }).max(255);
export const descriptionSchema = z.string().trim();
export const emailSchema = z.string().trim().email("Invalid email address").min(1).max(255);
export const passwordSchema = z.string().trim().min(8, { message: "Password must be at least 8 characters" }).max(255);
export const urlSchema = z.string().trim().url("Invalid URL").nullable();
export const phoneSchema = z.string().trim().min(10, { message: "Phone number must be valid" }).max(20);
export const addressSchema = z.string().trim().min(1, { message: "Address is required" }).max(500);

// Common date fields
export const dateSchema = z.coerce.date();

// Common ID fields
export const objectIdSchema = z.string().trim().min(1, { message: "ID is required" });

// Common array fields
export const stringArraySchema = z.array(z.string()).default([]);
