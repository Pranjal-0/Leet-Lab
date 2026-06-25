// import {PrismaClient} from "../generated/prisma/index.js"

// const globalForPrisma = globalThis;
// export const db = globalForPrisma.prisma || new PrismaClient();
// if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;



// import { PrismaClient } from "../generated/prisma/index.js";

// const globalForPrisma = globalThis;

// export const db =
//   globalForPrisma.prisma ||
//   new PrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = db;
// }

// import { PrismaClient } from "../generated/prisma/index.js";
// import { PrismaPg } from "@prisma/adapter-pg";

// const globalForPrisma = globalThis;

// const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// export const db =
//   globalForPrisma.prisma ||
//   new PrismaClient({ adapter });

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = db;
// }


import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

console.log("DB.JS LOADED - VERSION CHECK 123");

const globalForPrisma = globalThis;

const adapter = new PrismaPg({
  host: "localhost",
  port: 5432,
  user: "myuser",
  password: "mypassword",
  database: "myuser",
});

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}