"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { loginSchema, registerSchema, changePasswordSchema } from "@/lib/validations";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function registerAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validatedFields = registerSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive'
        }
      }
    });
    if (existingUser) {
      return { error: "Email is already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userCount = await prisma.user.count();
    const role = userCount === 0 ? "OWNER" : "USER";

    await prisma.user.create({
      data: { name, email, password: hashedPassword, role }
    });

    revalidatePath("/");
    return { success: "Account created successfully! You can now login." };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to create account. Please try again." };
  }
}

export async function loginAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/", // Redirect to home page by default
    });
    revalidatePath("/");
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function changePasswordAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to change your password." };
  }

  const data = Object.fromEntries(formData.entries());
  const validatedFields = changePasswordSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const { oldPassword, newPassword } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || !user.password) {
      return { error: "User not found." };
    }

    const passwordsMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordsMatch) {
      return { error: "Incorrect old password." };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword }
    });

    return { success: "Password changed successfully!" };
  } catch (error) {
    console.error("Password change error:", error);
    return { error: "Failed to change password. Please try again." };
  }
}
