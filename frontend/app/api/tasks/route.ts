import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get('page')) || 1;
        const limit = Number(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        const tasks = await prisma.task.findMany({
            skip,
            take: limit,
            orderBy: { id: 'desc' },
            include: {
                project: true,
                assignedTo: {
                    select: { name: true, email: true }
                }
            }
        });

        const total = await prisma.task.count();

        return NextResponse.json({
            data: tasks,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, status, priority, dueDate, projectId, assignedToUserId } = body;

        if (!title || !projectId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status: status || 'TODO',
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                projectId: Number(projectId),
                assignedToUserId: assignedToUserId ? Number(assignedToUserId) : null
            },
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
