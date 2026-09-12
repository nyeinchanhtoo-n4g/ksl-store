import { updateSalesStatementEntry } from "@/actions/ledger.actions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

const input = "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white";

export default async function EditSalesEntryPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const entry = await prisma.salesStatementEntry.findUnique({ where: { id } });
  if (!entry) notFound();
  return <div className="mx-auto max-w-4xl"><Link href="/admin/sales" className="text-sm text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white">Back to Sales Statement</Link><h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Edit Sales Entry</h1><form action={updateSalesStatementEntry} className="mt-6 grid gap-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-3"><input type="hidden" name="id" value={entry.id} /><Field label="Date" name="date" type="date" value={entry.date.toISOString().slice(0, 10)} required /><Field label="Waybill No" name="waybillNo" value={entry.waybillNo || ""} /><Field label="Receiver Name" name="receiverName" value={entry.receiverName || ""} /><Field label="Product Name" name="productName" value={entry.productName} required /><Field label="To City" name="toCity" value={entry.toCity || ""} /><Field label="Price" name="price" type="number" value={entry.price == null ? "" : String(entry.price)} /><Field label="Prepayment" name="prepayment" type="number" value={entry.prepayment == null ? "" : String(entry.prepayment)} /><Field label="Deli Charge" name="deliCharge" type="number" value={entry.deliCharge == null ? "" : String(entry.deliCharge)} /><Field label="COD Charge" name="codCharge" type="number" value={entry.codCharge == null ? "" : String(entry.codCharge)} /><Field label="COD Amount" name="codAmount" type="number" value={entry.codAmount == null ? "" : String(entry.codAmount)} /><Field label="Closing Balance" name="closingBalance" type="number" value={entry.closingBalance == null ? "" : String(entry.closingBalance)} /><div className="md:col-span-3 flex justify-end"><button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Save Changes</button></div></form></div>;
}

function Field({ label, name, type = "text", value, required }: { label: string; name: string; type?: string; value: string; required?: boolean }) { const isNumeric = type === "number"; return <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">{label}<input name={name} type={isNumeric ? "text" : type} inputMode={isNumeric ? "numeric" : undefined} defaultValue={value} required={required} className={input} /></label>; }
