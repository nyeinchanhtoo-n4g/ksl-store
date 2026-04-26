import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Product schemas
export const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  description: z.string().trim().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock must be non-negative"),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

// Order schemas
export const guestOrderSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s-]{7,14}[0-9]$/, "Invalid phone number"),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  method: z.enum(["telegram", "viber"]),
});

export const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.coerce.number().int().positive("Quantity must be positive"),
  price: z.coerce.number().positive("Price must be positive"),
});

// Settings schemas
export const settingsSchema = z.object({
  telegramUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  viberUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type GuestOrderInput = z.infer<typeof guestOrderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
