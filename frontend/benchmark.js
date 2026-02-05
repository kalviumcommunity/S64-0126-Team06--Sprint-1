const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('--- Starting Benchmark (JS) ---')
    await prisma.task.findMany({ take: 1 }) // Warmup

    const ITERATIONS = 20

    console.log(`\nRunning ${ITERATIONS} iterations: Find Tasks by Status...`)
    const start1 = performance.now()
    for (let i = 0; i < ITERATIONS; i++) {
        await prisma.task.findMany({ where: { status: 'TODO' } })
    }
    const end1 = performance.now()
    console.log(`Average time: ${((end1 - start1) / ITERATIONS).toFixed(4)} ms`)

    const user = await prisma.user.findFirst()
    const userId = user ? user.id : 1

    console.log(`\nRunning ${ITERATIONS} iterations: Find Projects by UserId...`)
    const start2 = performance.now()
    for (let i = 0; i < ITERATIONS; i++) {
        await prisma.project.findMany({ where: { userId: userId } })
    }
    const end2 = performance.now()
    console.log(`Average time: ${((end2 - start2) / ITERATIONS).toFixed(4)} ms`)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
