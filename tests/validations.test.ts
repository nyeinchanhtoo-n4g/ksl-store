import assert from "node:assert/strict";
import test from "node:test";
import {
  carouselSlideSchema,
  manualOrderSchema,
  normalizeMyanmarDigits,
  productSchema,
  settingsSchema,
} from "../src/lib/validations";

const cloudinaryImage = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

test("Myanmar digits are normalized to English digits for amounts", () => {
  assert.equal(normalizeMyanmarDigits("၁၂၀၀၀၀"), "120000");
  const result = productSchema.safeParse({
    name: "Leather Bag",
    description: "A full-grain leather bag",
    price: "၁၂၀၀၀၀",
    originalPrice: "၁၅၀၀၀၀",
    stock: "၃",
    imageUrl: cloudinaryImage,
    collectionId: "",
  });

  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.price, 120000);
});

test("manual order money fields accept Myanmar digits", () => {
  const result = manualOrderSchema.safeParse({
    customerName: "Aung Aung",
    customerAccount: "Facebook",
    customerPhone: "09123456789",
    deliveryAddress: "Yangon",
    itemName: "Leather Wallet",
    description: "Brown wallet",
    leather: "Full grain",
    price: "၁၂၀၀၀၀",
    quantity: "၁",
    totalAmount: "၁၂၀၀၀၀",
    deposit: "၅၀၀၀၀",
    deliveryCharge: "၃၀၀၀",
    deliveryDate: "",
    setupNote: "",
    attachmentUrls: "",
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.price, 120000);
    assert.equal(result.data.deposit, 50000);
  }
});

test("product input accepts whole Kyat amounts and trusted image hosts", () => {
  const result = productSchema.safeParse({
    name: "Leather Bag",
    description: "A full-grain leather bag",
    price: "120000",
    originalPrice: "150000",
    stock: "3",
    imageUrl: cloudinaryImage,
    collectionId: "",
  });

  assert.equal(result.success, true);
});

test("product input rejects fractional prices, negative stock, and unknown image hosts", () => {
  const result = productSchema.safeParse({
    name: "Leather Bag",
    description: "A full-grain leather bag",
    price: "120000.50",
    originalPrice: "",
    stock: "-1",
    imageUrl: "https://example.com/image.jpg",
    collectionId: "",
  });

  assert.equal(result.success, false);
});

test("settings only accept the intended Telegram and Viber URL schemes", () => {
  assert.equal(
    settingsSchema.safeParse({
      logoUrl: cloudinaryImage,
      faviconUrl: "",
      telegramUrl: "https://t.me/store",
      viberUrl: "viber://chat?number=959123456789",
    }).success,
    true
  );

  assert.equal(
    settingsSchema.safeParse({
      logoUrl: "",
      faviconUrl: "",
      telegramUrl: "javascript:alert(1)",
      viberUrl: "https://example.com",
    }).success,
    false
  );

  assert.equal(
    settingsSchema.safeParse({
      logoUrl: "",
      faviconUrl: "",
      telegramUrl: "",
      viberUrl: "https://viber.me/959123456789",
    }).success,
    true
  );
});

test("carousel links are restricted to internal navigation", () => {
  assert.equal(
    carouselSlideSchema.safeParse({
      title: "New collection",
      subtitle: "",
      imageUrl: cloudinaryImage,
      buttonText: "Shop now",
      buttonHref: "/#products",
      sortOrder: "0",
      isActive: true,
    }).success,
    true
  );

  assert.equal(
    carouselSlideSchema.safeParse({
      title: "New collection",
      subtitle: "",
      imageUrl: cloudinaryImage,
      buttonText: "Shop now",
      buttonHref: "javascript:alert(1)",
      sortOrder: "0",
      isActive: true,
    }).success,
    false
  );
});
