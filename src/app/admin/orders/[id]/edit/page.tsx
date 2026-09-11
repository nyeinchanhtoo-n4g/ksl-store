import { updateManualOrder } from "@/actions/order.actions";
import AttachmentUploadField from "@/components/admin/AttachmentUploadField";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

const input = "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white";

export default async function EditManualOrderPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: { orderBy: { id: "asc" }, take: 1 } } });
  if (!order || !order.isManual || !order.items[0]) notFound();
  const item = order.items[0];
  const dateValue = order.deliveryDate ? order.deliveryDate.toISOString().slice(0, 10) : "";

  return <div className="mx-auto max-w-4xl"><Link href={`/admin/orders/${id}`} className="text-sm text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white">Back to order</Link><h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Edit Manual Order</h1><form action={updateManualOrder} className="mt-6 grid gap-5 rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-2"><input type="hidden" name="orderId" value={order.id} /><Field label="Customer Name" name="customerName" value={order.customerName || ""} required /><Field label="Account / Channel" name="customerAccount" value={order.customerAccount || ""} /><Field label="Phone Number" name="customerPhone" value={order.customerPhone || ""} /><Field label="Delivery Date" name="deliveryDate" type="date" value={dateValue} /><div className="md:col-span-2"><Field label="Delivery Address" name="deliveryAddress" value={order.deliveryAddress || ""} /></div><Field label="Item Name" name="itemName" value={item.itemName || ""} required /><Field label="Leather" name="leather" value={order.leather || ""} /><div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Description<textarea name="description" rows={3} defaultValue={item.description || ""} className={input} /></label></div><Field label="Price (Ks)" name="price" type="number" value={String(item.price)} required min="1" /><Field label="Quantity" name="quantity" type="number" value={String(item.quantity)} required min="1" /><Field label="Deposit (Ks)" name="deposit" type="number" value={order.deposit == null ? "" : String(order.deposit)} min="0" /><Field label="Deli Charge (Ks)" name="deliveryCharge" type="number" value={order.deliveryCharge == null ? "" : String(order.deliveryCharge)} min="0" /><div className="md:col-span-2"><Field label="Total Amount (Ks)" name="totalAmount" type="number" value={String(order.totalAmount)} required min="0" /></div><div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Setup Note<textarea name="setupNote" rows={3} defaultValue={order.setupNote || ""} className={input} /></label></div><AttachmentUploadField initialUrls={order.attachmentUrls || ""} /><div className="md:col-span-2 flex justify-end"><button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Save Changes</button></div></form></div>;
}

function Field({ label, name, type = "text", value, required, min }: { label: string; name: string; type?: string; value: string; required?: boolean; min?: string }) { return <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">{label}<input name={name} type={type} defaultValue={value} required={required} min={min} className={input} /></label>; }
