const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('--- Starting Transaction Demo (JS) ---')

    try {
        console.log('\n[Success Scenario] Creating project and tasks...')

        const user = await prisma.user.findFirst()
        if (!user) throw new Error("No users found.")

        const result = await prisma.$transaction(async (tx) => {
            const project = await tx.project.create({
                data: {
                    name: "Transaction Demo Project",
                    description: "Created via Prisma Transaction (JS)",
                    userId: user.id
                }
            })

            await tx.task.create({
                data: { title: "Task 1", projectId: project.id, status: "TODO" }
            })

            return project
        })

        console.log('✅ Transaction Successful! Project ID:', result.id)

    } catch (error) {
        console.error('❌ Unexpected error:', error)
    }

    try {
        console.log('\n[Failure Scenario] Attempting rollback...')
        const user = await prisma.user.findFirst()

        await prisma.$transaction(async (tx) => {
            const project = await tx.project.create({
                data: {
                    name: "Rollback Demo Project",
                    userId: user.id
                }
            })
            console.log('   -> Project created (pending commit).')

            throw new Error("Simulated Error!")
        })

    } catch (error) {
        console.log('✅ Caught expected error:', error.message)
    }

    const ghostProject = await prisma.project.findFirst({
        where: { name: "Rollback Demo Project" }
    })
    if (!ghostProject) {
        console.log('✅ Verified: Project successfully rolled back.')
    } else {
        console.error('❌ Failed: Project exists.')
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
