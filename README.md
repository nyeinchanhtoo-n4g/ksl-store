# H²O LEATHER E-commerce

မြန်မာနိုင်ငံအတွက် အွန်လိုင်းစျေးဝယ်ဆိုင်ပလက်ဖောင်း

## Tech Stack

- **Framework**: Next.js 16.2.4 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth v5
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Charts**: Recharts
- **Validation**: Zod
- **Code Formatting**: Prettier

## Features

- အသုံးပြုသူမှတ်ပုံတင်နှင့် ဝင်ရောက်စနစ်
- ကုန်ပစ္စည်းများ ကြည့်ရှုနိုင်ခြင်း
- စျေးခြင်းတောင်း (Cart)
- ဧည့်သည်အတွက် အမှာစာချုပ်စနစ် (Guest Checkout)
- စီမံခန့်ခွဲမှုပန်းနယ် (Admin Dashboard)
  - ကုန်ပစ္စည်းစီမံခန့်ခွဲမှု
  - အမှာစာစီမံခန့်ခွဲမှု
  - အသုံးပြုသူစီမံခန့်ခွဲမှု
  - ဆိုက်ဆက်ချက်များ ပြင်ဆင်မှု
- အမှောင်/အလင်း မုဒ်
- Telegram နှင့် Viber မှတဆင့် အမှာစာဆက်သွယ်မှု

## Getting Started

### Prerequisites

- Node.js 20+ 
- PostgreSQL database

### Installation

1. ပရောဂျက် clone လုပ်ပါ
```bash
git clone <repository-url>
cd ksl-project
```

2. Dependencies များ install လုပ်ပါ
```bash
npm install
```

3. Environment variables ပြင်ဆင်ပါ
```bash
cp .env.example .env
```

`.env` ဖိုင်ထဲမှာ သင့် database connection နဲ့ secret keys များထည့်ပါ:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. Database setup လုပ်ပါ
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. Development server စတင်ပါ
```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) ကို browser မှာဖွင့်ပါ

## Available Scripts

- `npm run dev` - Development server စတင်မည်
- `npm run build` - Production build လုပ်မည်
- `npm run start` - Production server စတင်မည်
- `npm run lint` - ESLint စစ်ဆေးမည်
- `npm run format` - Prettier ဖြင့် code formatting လုပ်မည်

## Project Structure

```
src/
├── actions/          # Server actions
├── app/             # Next.js App Router pages
├── components/      # React components
├── lib/             # Utility functions
├── store/           # Zustand state management
├── types/           # TypeScript type definitions
├── auth.config.ts   # NextAuth configuration
└── auth.ts          # NextAuth setup
```

## Database Schema

Prisma schema ကို `prisma/schema.prisma` တွင် ကြည့်နိုင်ပါသည်။

အဓိက models:
- User (အသုံးပြုသူ)
- Product (ကုန်ပစ္စည်း)
- Order (အမှာစာ)
- OrderItem (အမှာစာအချက်အလက်)
- StoreSettings (ဆိုက်ဆက်ချက်များ)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://authjs.dev)

## License

MIT
