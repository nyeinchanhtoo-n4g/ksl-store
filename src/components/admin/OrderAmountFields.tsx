'use client';

import { useState } from 'react';
import { calculateOrderTotal, type OrderAmountInputs } from '@/lib/order-amounts';

const input =
  'mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white';

type InitialAmounts = Partial<OrderAmountInputs> & {
  quantity?: string;
  totalAmount?: string;
};

export default function OrderAmountFields({
  initialValues = {},
}: {
  initialValues?: InitialAmounts;
}) {
  const [values, setValues] = useState<OrderAmountInputs>(() => ({
    price: initialValues.price ?? '',
    deposit: initialValues.deposit ?? '',
    extraCharge: initialValues.extraCharge ?? '',
    deliveryCharge: initialValues.deliveryCharge ?? '',
  }));
  const [totalAmount, setTotalAmount] = useState(initialValues.totalAmount ?? '');

  function updateAmount(name: keyof OrderAmountInputs, value: string) {
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    setTotalAmount(calculateOrderTotal(nextValues));
  }

  return (
    <>
      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
        Price (Ks)
        <input
          name="price"
          type="text"
          inputMode="numeric"
          required
          value={values.price}
          onChange={(event) => updateAmount('price', event.target.value)}
          className={input}
        />
      </label>
      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
        Quantity
        <input
          name="quantity"
          type="text"
          inputMode="numeric"
          required
          defaultValue={initialValues.quantity ?? ''}
          className={input}
        />
      </label>
      {(
        [
          ['deposit', 'Deposit (Ks)'],
          ['extraCharge', 'Extra Charge (Ks)'],
          ['deliveryCharge', 'Deli Charge (Ks)'],
        ] as const
      ).map(([name, label]) => (
        <label key={name} className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
          {label}
          <input
            name={name}
            type="text"
            inputMode="numeric"
            value={values[name]}
            onChange={(event) => updateAmount(name, event.target.value)}
            className={input}
          />
        </label>
      ))}
      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 md:col-span-2">
        Total Amount (Ks)
        <input
          name="totalAmount"
          type="text"
          inputMode="numeric"
          required
          value={totalAmount}
          onChange={(event) => setTotalAmount(event.target.value)}
          className={input}
        />
      </label>
    </>
  );
}
