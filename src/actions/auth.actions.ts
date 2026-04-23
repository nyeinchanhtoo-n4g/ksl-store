"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
    return { error: "All fields are required" };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "Email is already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userCount = await prisma.user.count();
    const role = userCount === 0 ? "OWNER" : "USER";

    await prisma.user.create({
      data: { name, email, password: hashedPassword, role }
    });

    return { success: "Account created successfully! You can now login." };
  } catch (error) {
    return { error: "Failed to create account. Please try again." };
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "All fields are required" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/", 
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error; // Let Next.js handle the redirect specifically
  }
}
