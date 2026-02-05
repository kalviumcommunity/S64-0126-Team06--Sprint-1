import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- Starting Performance Benchmark ---')

    // Ensure we have enough data (optional, but good for real benchmarks)
    // For now we run queries against whatever seed data is there.

    // Warmup
    await prisma.task.findMany({ take: 1 })

    // Benchmark 1: Filter Tokens by status (simulating a common dashboard query)
    // We will run this multiple times to get average
    const ITERATIONS = 20

    console.log(`\nRunning ${ITERATIONS} iterations for query: Find Tasks by Status...`)
    const start1 = performance.now()
    for (let i = 0; i < ITERATIONS; i++) {
        await prisma.task.findMany({
            where: {
                status: 'TODO'
            }
        })
    }
    const end1 = performance.now()
    const avg1 = (end1 - start1) / ITERATIONS
    console.log(`Average time (Find Tasks by Status): ${avg1.toFixed(4)} ms`)


    // Benchmark 2: Find Projects for a user (simulating nested join logic if we did it manually, or just simple filter)
    // Let's assume we search by userId which is a foreign key
    // We'll pick a User ID that likely exists, or create a dummy one if needed.
    const user = await prisma.user.findFirst()
    const userId = user ? user.id : 1

    console.log(`\nRunning ${ITERATIONS} iterations for query: Find Projects by UserId...`)
    const start2 = performance.now()
    for (let i = 0; i < ITERATIONS; i++) {
        await prisma.project.findMany({
            where: {
                userId: userId
            }
        })
    }
    const end2 = performance.now()
    const avg2 = (end2 - start2) / ITERATIONS
    console.log(`Average time (Find Projects by UserId): ${avg2.toFixed(4)} ms`)

    console.log('\n--- Benchmark Complete ---')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
