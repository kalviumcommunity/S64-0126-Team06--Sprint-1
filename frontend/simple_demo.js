try {
    console.log("Attempting to require prisma client...");
    const { PrismaClient } = require('@prisma/client');
    console.log("Successfully required PrismaClient");
    const prisma = new PrismaClient();
    console.log("Successfully instantiated PrismaClient");
} catch (e) {
    console.error("Error requiring/using PrismaClient:", e);
}
