import assert from "node:assert/strict";
import test from "node:test";
import {
  carouselSlideSchema,
  productSchema,
  settingsSchema,
} from "../src/lib/validations";

const cloudinaryImage = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

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
