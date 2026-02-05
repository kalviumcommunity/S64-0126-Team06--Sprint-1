import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // Create Users
    const alice = await prisma.user.upsert({
        where: { email: 'alice@example.com' },
        update: {},
        create: {
            email: 'alice@example.com',
            name: 'Alice',
            projects: {
                create: {
                    name: 'Website Redesign',
                    description: 'Redesigning the company landing page',
                    tasks: {
                        create: [
                            {
                                title: 'Design Mockups',
                                description: 'Create Figma mockups for desktop and mobile',
                                status: 'IN_PROGRESS',
                                priority: 'HIGH',
                            },
                            {
                                title: 'Implement Frontend',
                                description: 'Build components using Next.js',
                                status: 'TODO',
                                priority: 'HIGH',
                            },
                        ],
                    },
                },
            },
        },
    })

    const bob = await prisma.user.upsert({
        where: { email: 'bob@example.com' },
        update: {},
        create: {
            email: 'bob@example.com',
            name: 'Bob',
            projects: {
                create: {
                    name: 'Mobile App',
                    description: 'Native mobile application development',
                    tasks: {
                        create: {
                            title: 'Setup React Native',
                            status: 'DONE',
                            priority: 'MEDIUM',
                        },
                    },
                },
            },
        },
    })

    // Assign a task to Bob from Alice's project (demonstrating relations)
    const aliceProject = await prisma.project.findFirst({
        where: { userId: alice.id },
        include: { tasks: true }
    })

    if (aliceProject && aliceProject.tasks.length > 0) {
        await prisma.task.update({
            where: { id: aliceProject.tasks[1].id }, // 'Implement Frontend'
            data: {
                assignedToUserId: bob.id
            }
        })
    }

    console.log({ alice, bob })
    console.log('Seeding finished.')
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
