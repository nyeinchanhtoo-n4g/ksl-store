"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";
import { expenseStatementSchema, profitLossSummarySchema, salesStatementSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

function parseDate(value: string) { return new Date(`${value}T00:00:00`); }
export async function createSalesStatementEntry(formData: FormData) { await requireAdmin(); const parsed = salesStatementSchema.safeParse(Object.fromEntries(formData.entries())); if (!parsed.success) throw new Error(parsed.error.issues[0].message); const { date, ...data } = parsed.data; await prisma.salesStatementEntry.create({ data: { ...data, date: parseDate(date), waybillNo: data.waybillNo || null, receiverName: data.receiverName || null, toCity: data.toCity || null } }); revalidatePath('/admin/sales'); }
export async function createExpenseStatementEntry(formData: FormData) { await requireAdmin(); const parsed = expenseStatementSchema.safeParse(Object.fromEntries(formData.entries())); if (!parsed.success) throw new Error(parsed.error.issues[0].message); const { date, ...data } = parsed.data; await prisma.expenseStatementEntry.create({ data: { ...data, date: parseDate(date) } }); revalidatePath('/admin/expenses'); }
export async function createProfitLossSummary(formData: FormData) { await requireAdmin(); const parsed = profitLossSummarySchema.safeParse(Object.fromEntries(formData.entries())); if (!parsed.success) throw new Error(parsed.error.issues[0].message); const { startDate, endDate, note, ...data } = parsed.data; await prisma.profitLossSummary.create({ data: { ...data, startDate: parseDate(startDate), endDate: parseDate(endDate), note: note || null } }); revalidatePath('/admin/profit-loss'); }
