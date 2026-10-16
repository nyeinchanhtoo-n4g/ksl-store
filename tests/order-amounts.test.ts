import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateOrderTotal } from '../src/lib/order-amounts';
import { manualOrderSchema } from '../src/lib/validations';

const orderInput = {
  customerName: 'Test Account',
  itemName: 'Custom Wallet',
  price: '100000',
  quantity: '3',
  extraCharge: '5000',
  deliveryCharge: '3000',
  deposit: '20000',
  totalAmount: '88000',
  setupNote: 'Existing setup name',
};

test('order total adds extra and delivery charges and subtracts the deposit', () => {
  assert.equal(calculateOrderTotal(orderInput), '88000');
});

test('blank optional charges count as zero and full payment produces zero', () => {
  assert.equal(
    calculateOrderTotal({ price: '100000', extraCharge: '', deliveryCharge: '', deposit: '' }),
    '100000'
  );
  assert.equal(
    calculateOrderTotal({
      price: '100000',
      extraCharge: '5000',
      deliveryCharge: '3000',
      deposit: '108000',
    }),
    '0'
  );
});

test('automatic totals support Myanmar digits', () => {
  assert.equal(
    calculateOrderTotal({
      price: '၁၀၀၀၀၀',
      extraCharge: '၅၀၀၀',
      deliveryCharge: '၃၀၀၀',
      deposit: '၂၀၀၀၀',
    }),
    '88000'
  );
});

test('invalid amount input never produces a NaN or rounded total', () => {
  for (const price of ['abc', '100.5', '-1', 'Infinity', '9007199254740992']) {
    assert.equal(calculateOrderTotal({ ...orderInput, price }), '');
  }
});

test('overpayment is not silently clamped to another amount', () => {
  assert.equal(
    calculateOrderTotal({ price: '100', extraCharge: '', deliveryCharge: '', deposit: '200' }),
    '-100'
  );
});

test("manual order validation preserves an administrator's total override", () => {
  const result = manualOrderSchema.parse({
    ...orderInput,
    totalAmount: '၈၅၀၀၀',
    extraCharge: '၅၀၀၀',
  });
  assert.equal(result.totalAmount, 85000);
  assert.equal(result.extraCharge, 5000);
  assert.equal(result.quantity, 3);
  assert.equal(result.setupNote, 'Existing setup name');
});

test('old orders and blank extra charges remain compatible', () => {
  assert.equal(
    manualOrderSchema.parse({ ...orderInput, extraCharge: undefined }).extraCharge,
    null
  );
  assert.equal(manualOrderSchema.parse({ ...orderInput, extraCharge: '' }).extraCharge, null);
  assert.equal(manualOrderSchema.parse({ ...orderInput, extraCharge: '0' }).extraCharge, 0);
});

test('extra charges reject negative, fractional, and invalid amounts', () => {
  for (const extraCharge of ['-100', '10.5', 'invalid']) {
    assert.equal(manualOrderSchema.safeParse({ ...orderInput, extraCharge }).success, false);
  }
});
