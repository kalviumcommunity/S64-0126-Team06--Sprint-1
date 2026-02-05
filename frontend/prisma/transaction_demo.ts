import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- Starting Transaction Demo ---')

    // 1. Success Scenario
    try {
        console.log('\n[Success Scenario] Attempting to create a project and tasks atomically...')

        // Pick an existing user to assign the project to
        const user = await prisma.user.findFirst()
        if (!user) {
            throw new Error("No users found. Please seed the database first.")
        }

        const result = await prisma.$transaction(async (tx) => {
            // Create a project
            const project = await tx.project.create({
                data: {
                    name: "Transaction Demo Project",
                    description: "Created via Prisma Transaction",
                    userId: user.id
                }
            })

            // Create tasks for this project
            await tx.task.create({
                data: {
                    title: "Task 1: Planning",
                    projectId: project.id,
                    status: "TODO"
                }
            })

            await tx.task.create({
                data: {
                    title: "Task 2: Execution",
                    projectId: project.id,
                    status: "TODO"
                }
            })

            return project
        })

        console.log('✅ Transaction Successful! Created Project ID:', result.id)

        // Verify it exists
        const savedProject = await prisma.project.findUnique({
            where: { id: result.id },
            include: { tasks: true }
        })
        console.log('Verified in DB:', savedProject?.name, `with ${savedProject?.tasks.length} tasks.`)

    } catch (error) {
        console.error('❌ Unexpected error in success scenario:', error)
    }

    // 2. Failure/Rollback Scenario
    try {
        console.log('\n[Failure Scenario] Attempting to create a project with an INVALID task...')

        const user = await prisma.user.findFirst()
        if (!user) {
            throw new Error("No users found.")
        }

        await prisma.$transaction(async (tx) => {
            // Create project
            const project = await tx.project.create({
                data: {
                    name: "Rollback Demo Project",
                    description: "This should NOT exist after rollback",
                    userId: user.id
                }
            })
            console.log('   -> Step 1: Project created (in memory transaction). ID:', project.id)

            // Create a valid task
            await tx.task.create({
                data: {
                    title: "Valid Task",
                    projectId: project.id
                }
            })
            console.log('   -> Step 2: Valid task created.')

            // THROW ERROR to release rollback
            throw new Error("Simulated Error: Something went wrong halfway!")

            // This line will never be reached
            // await tx.task.create(...) 
        })

    } catch (error: any) {
        console.log('✅ Caught expected error:', error.message)
        console.log('   -> Transaction should have rolled back.')
    }

    // Verify Rollback
    const ghostProject = await prisma.project.findFirst({
        where: { name: "Rollback Demo Project" }
    })

    if (!ghostProject) {
        console.log('✅ Verification Successful: "Rollback Demo Project" was NOT found in the database.')
    } else {
        console.error('❌ Verification Failed: The project was found! Rollback failed.')
    }

    console.log('\n--- End Transaction Demo ---')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
