import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type AdminRole = "ADMIN" | "OWNER";

export async function requireAdmin(): Promise<{ id: string; role: AdminRole }> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "OWNER")) {
    throw new Error("Unauthorized.");
  }

  return { id: user.id, role: user.role as AdminRole };
}

export async function requireOwner(): Promise<{ id: string; role: "OWNER" }> {
  const user = await requireAdmin();

  if (user.role !== "OWNER") {
    throw new Error("Unauthorized: Only an OWNER can perform this action.");
  }

  return { id: user.id, role: "OWNER" };
}
