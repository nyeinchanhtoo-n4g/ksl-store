import { z } from "zod";

const allowedImageHosts = new Set(["images.unsplash.com", "res.cloudinary.com"]);

function isAllowedImageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && allowedImageHosts.has(url.hostname);
  } catch {
    return false;
  }
}

const imageUrlSchema = z
  .string()
  .trim()
  .url("Invalid image URL")
  .refine(isAllowedImageUrl, "Use an HTTPS image from Unsplash or Cloudinary");

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
  price: z.coerce.number().int("Price must be a whole Kyat amount").positive("Price must be positive"),
  originalPrice: z
    .union([z.literal(""), z.coerce.number().int("Original price must be a whole Kyat amount").nonnegative("Original price must not be negative")])
    .transform((value) => (value === "" ? null : value)),
  stock: z.coerce.number().int().min(0, "Stock must be non-negative"),
  imageUrl: imageUrlSchema.optional().or(z.literal("")),
  collectionId: z.string().trim().optional().or(z.literal("")),
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
  logoUrl: imageUrlSchema.optional().or(z.literal("")),
  faviconUrl: imageUrlSchema.optional().or(z.literal("")),
  telegramUrl: z.string().trim().url("Invalid Telegram URL").refine((value) => {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "t.me";
  }, "Use an HTTPS t.me URL").optional().or(z.literal("")),
  viberUrl: z.string().trim().url("Invalid Viber URL").refine((value) => {
    const url = new URL(value);
    return url.protocol === "viber:";
  }, "Use a viber:// URL").optional().or(z.literal("")),
});

export const carouselSlideSchema = z.object({
  title: z.string().trim().min(1, "Slide title is required").max(160),
  subtitle: z.string().trim().max(1_000).optional().or(z.literal("")),
  imageUrl: imageUrlSchema,
  buttonText: z.string().trim().max(80).optional().or(z.literal("")),
  buttonHref: z
    .string()
    .trim()
    .refine((value) => value === "" || value.startsWith("/") || value.startsWith("#"), "Button link must be an internal path or page anchor")
    .optional()
    .or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).max(10_000),
  isActive: z.boolean(),
});

const money = z.union([z.literal(""), z.coerce.number().int().nonnegative()]).transform((value) => value === "" ? null : value);

export const manualOrderSchema = z.object({
  customerName: z.string().trim().min(2).max(80), customerAccount: z.string().trim().max(120).optional().or(z.literal("")),
  customerPhone: z.string().trim().max(30).optional().or(z.literal("")), deliveryAddress: z.string().trim().max(500).optional().or(z.literal("")),
  itemName: z.string().trim().min(1).max(160), leather: z.string().trim().max(160).optional().or(z.literal("")),
  price: z.coerce.number().int().positive(), quantity: z.coerce.number().int().positive(), totalAmount: z.coerce.number().int().nonnegative(),
  deposit: money, deliveryCharge: money,
  deliveryDate: z.string().trim().optional().or(z.literal("")), setupNote: z.string().trim().max(1_000).optional().or(z.literal("")), attachmentUrls: z.string().trim().max(4_000).optional().or(z.literal("")),
});

export const salesStatementSchema = z.object({ date: z.string().min(1), waybillNo: z.string().trim().max(100).optional().or(z.literal("")), receiverName: z.string().trim().max(120).optional().or(z.literal("")), productName: z.string().trim().min(1).max(160), toCity: z.string().trim().max(120).optional().or(z.literal("")), price: money, prepayment: money, deliCharge: money, codCharge: money, codAmount: money, closingBalance: money });
export const expenseStatementSchema = z.object({ date: z.string().min(1), productName: z.string().trim().min(1).max(160), cost: money, quantity: z.union([z.literal(""), z.coerce.number().int().nonnegative()]).transform((value) => value === "" ? null : value), totalCost: money, deliCharge: money, closingAmount: money });
export const profitLossSummarySchema = z.object({ period: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]), startDate: z.string().min(1), endDate: z.string().min(1), salesAmount: money, expenseAmount: money, profitLoss: money, note: z.string().trim().max(1_000).optional().or(z.literal("")) });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type GuestOrderInput = z.infer<typeof guestOrderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
