// import "dotenv/config";
// import { PrismaPg } from '@prisma/adapter-pg'
// import { PrismaClient } from '../generated/prisma/client'

// const connectionString = `${process.env.DATABASE_URL}`

// const adapter = new PrismaPg({ connectionString })
// const prisma = new PrismaClient({ adapter })

// export { prisma }

import "dotenv/config";
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const { Pool } = pg;
const connectionString = `${process.env.DATABASE_URL}`;

// ၁။ Connection Pool တစ်ခုတည်းကိုပဲ သုံးမယ်
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// ၂။ Global Variable ထဲမှာ သိမ်းထားမယ့် အမျိုးအစား သတ်မှတ်မယ်
const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// ၃။ ရှိပြီးသားဆိုရင် အသစ်မဆောက်ဘဲ အဟောင်းကို ပြန်သုံးမယ် (Singleton)
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;