import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Create a user
    const user = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
            name: 'Test User',
            projects: {
                create: {
                    name: 'My First Project',
                    description: 'This is a sample project',
                    tasks: {
                        create: [
                            {
                                title: 'Task 1',
                                status: 'TODO',
                                priority: 'High'
                            },
                            {
                                title: 'Task 2',
                                status: 'IN_PROGRESS',
                                priority: 'Medium'
                            }
                        ]
                    }
                }
            }
        },
    })

    console.log({ user })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
