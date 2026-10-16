import { normalizeMyanmarDigits } from './validations';

export type OrderAmountInputs = {
  price: string;
  quantity: string;
  extraCharge: string;
  deliveryCharge: string;
  deposit: string;
};

export function calculateOrderTotal(values: OrderAmountInputs): string {
  const quantity = Number(normalizeMyanmarDigits(values.quantity.trim()));
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    return '';
  }

  const amounts = [values.price, values.extraCharge, values.deliveryCharge, values.deposit].map(
    (value) => Number(normalizeMyanmarDigits(value.trim()))
  );

  if (amounts.some((value) => !Number.isSafeInteger(value) || value < 0)) {
    return '';
  }

  const [price, extraCharge, deliveryCharge, deposit] = amounts;
  const subtotal = price * quantity;
  if (!Number.isSafeInteger(subtotal)) {
    return '';
  }
  const total = subtotal + extraCharge + deliveryCharge - deposit;
  return Number.isSafeInteger(total) ? String(total) : '';
}
