import { deleteExpenseStatementEntry } from "@/actions/ledger.actions";
import LedgerDeleteButton from "@/components/admin/LedgerDeleteButton";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Table } from "../sales/page";

const cols = ["Date", "Product Name", "Cost", "Quantity", "Total Cost", "Deli Charge", "Closing Amount"];
export default async function ExpensesPage() { const entries = await prisma.expenseStatementEntry.findMany({ orderBy: { date: "desc" }, take: 100 }); return <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expense Statement</h1><Link href="/admin/expenses/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Create Expense</Link></div><Table cols={cols} rows={entries.map(x => [x.date.toLocaleDateString(),x.productName,x.cost,x.quantity,x.totalCost,x.deliCharge,x.closingAmount])} actions={(index) => <><Link href={`/admin/expenses/${entries[index].id}/edit`} aria-label="Edit entry" className="text-amber-600 hover:text-amber-700 dark:text-amber-400">Edit</Link><LedgerDeleteButton onDelete={deleteExpenseStatementEntry.bind(null, entries[index].id)} /></>} /></div>; }
