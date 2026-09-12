import { updateExpenseStatementEntry } from "@/actions/ledger.actions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SubmitButton from "@/components/admin/SubmitButton";
import { notFound } from "next/navigation";

const input = "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white";

export default async function EditExpenseEntryPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const entry = await prisma.expenseStatementEntry.findUnique({ where: { id } });
  if (!entry) notFound();
  return <div className="mx-auto max-w-4xl"><Link href="/admin/expenses" className="text-sm text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white">Back to Expense Statement</Link><h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Edit Expense Entry</h1><form action={updateExpenseStatementEntry} className="mt-6 grid gap-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-3"><input type="hidden" name="id" value={entry.id} /><Field label="Date" name="date" type="date" value={entry.date.toISOString().slice(0, 10)} required /><Field label="Product Name" name="productName" value={entry.productName} required /><Field label="Cost" name="cost" type="number" value={entry.cost == null ? "" : String(entry.cost)} /><Field label="Quantity" name="quantity" type="number" value={entry.quantity == null ? "" : String(entry.quantity)} /><Field label="Total Cost" name="totalCost" type="number" value={entry.totalCost == null ? "" : String(entry.totalCost)} /><Field label="Deli Charge" name="deliCharge" type="number" value={entry.deliCharge == null ? "" : String(entry.deliCharge)} /><Field label="Closing Amount" name="closingAmount" type="number" value={entry.closingAmount == null ? "" : String(entry.closingAmount)} /><TextAreaField label="Note" name="note" value={entry.note || ""} /><div className="md:col-span-3 flex justify-end"><SubmitButton pendingLabel="Saving..." className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Save Changes</SubmitButton></div></form></div>;
}

function Field({ label, name, type = "text", value, required }: { label: string; name: string; type?: string; value: string; required?: boolean }) { const isNumeric = type === "number"; return <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">{label}<input name={name} type={isNumeric ? "text" : type} inputMode={isNumeric ? "numeric" : undefined} defaultValue={value} required={required} className={input} /></label>; }
function TextAreaField({ label, name, value }: { label: string; name: string; value: string }) { return <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 md:col-span-3">{label}<textarea name={name} rows={3} defaultValue={value} className={input} /></label>; }
