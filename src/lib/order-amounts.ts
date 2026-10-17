import { normalizeMyanmarDigits } from './validations';

export type OrderAmountInputs = {
  price: string;
  extraCharge: string;
  deliveryCharge: string;
  deposit: string;
};

export function calculateOrderTotal(values: OrderAmountInputs): string {
  const amounts = [values.price, values.extraCharge, values.deliveryCharge, values.deposit].map(
    (value) => Number(normalizeMyanmarDigits(value.trim()))
  );

  if (amounts.some((value) => !Number.isSafeInteger(value) || value < 0)) {
    return '';
  }

  const [price, extraCharge, deliveryCharge, deposit] = amounts;
  const total = price + extraCharge + deliveryCharge - deposit;
  return Number.isSafeInteger(total) ? String(total) : '';
}
