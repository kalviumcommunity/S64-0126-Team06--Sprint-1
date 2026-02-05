
import { prisma } from './lib/prisma';

async function main() {
    try {
        const users = await prisma.user.findMany();
        console.log('Connection successful!');
        console.log('Users found:', users);
    } catch (e) {
        console.error('Error connecting to database:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
