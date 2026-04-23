import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Cleaning up existing products...");
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});

  console.log("Seeding sample products...");
  
  const products = [
    {
      name: "Apple iPhone 15 Pro Max",
      description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
      price: 3500000,
      stock: 50,
      imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "MacBook Pro M3 Max",
      description: "Mind-blowing performance. Boundary-breaking battery life. The most advanced display ever in a laptop. Now in a new Space Black finish.",
      price: 7800000,
      stock: 15,
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Sony WH-1000XM5",
      description: "Industry-leading noise cancellation. Exceptional sound quality. Unrivaled noise cancelling and up to 30 hours of battery life.",
      price: 950000,
      stock: 120,
      imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Keychron Q1 Pro Custom Keyboard",
      description: "A premium QMK/VIA wireless custom mechanical keyboard. Full aluminum body with double-gasket design for the ultimate typing experience.",
      price: 550000,
      stock: 30,
      imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Samsung Odyssey OLED G9",
      description: "49-inch curved OLED gaming monitor. 240Hz refresh rate and 0.03ms response time. The ultimate immersive gaming experience.",
      price: 4200000,
      stock: 10,
      imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Rolex Submariner Date",
      description: "The reference among divers' watches. Oyster, 41 mm, Oystersteel. Unidirectional rotatable bezel with Cerachrom insert in green ceramic.",
      price: 25000000,
      stock: 3,
      imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop",
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
