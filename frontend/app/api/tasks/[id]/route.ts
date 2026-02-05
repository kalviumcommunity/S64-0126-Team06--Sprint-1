import { prisma } from '@/lib/prisma';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ERROR_CODES } from '@/lib/errorCodes';
import { taskSchema } from '@/lib/schemas/taskSchema';
import { ZodError } from 'zod';
import { formatZodError } from '@/lib/zodErrorHandler';

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number(params.id);
        if (isNaN(id)) {
            return sendError('Invalid ID', ERROR_CODES.VALIDATION_ERROR, 400);
        }

        const task = await prisma.task.findUnique({
            where: { id },
            include: {
                project: true,
                assignedTo: {
                    select: { name: true, email: true }
                }
            }
        });

        if (!task) {
            return sendError('Task not found', ERROR_CODES.NOT_FOUND, 404);
        }

        return sendSuccess(task, 'Task fetched successfully');
    } catch (error) {
        console.error('Error fetching task:', error);
        return sendError('Internal Server Error', ERROR_CODES.INTERNAL_ERROR, 500, error);
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number(params.id);
        if (isNaN(id)) {
            return sendError('Invalid ID', ERROR_CODES.VALIDATION_ERROR, 400);
        }

        const body = await req.json();
        const validatedData = taskSchema.partial().parse(body);

        const task = await prisma.task.update({
            where: { id },
            data: validatedData,
        });

        return sendSuccess(task, 'Task updated successfully');
    } catch (error) {
        if (error instanceof ZodError) {
            return sendError(
                'Validation Error',
                ERROR_CODES.VALIDATION_ERROR,
                400,
                formatZodError(error)
            );
        }
        console.error('Error updating task:', error);
        return sendError('Internal Server Error', ERROR_CODES.INTERNAL_ERROR, 500, error);
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number(params.id);
        if (isNaN(id)) {
            return sendError('Invalid ID', ERROR_CODES.VALIDATION_ERROR, 400);
        }

        await prisma.task.delete({
            where: { id },
        });

        return sendSuccess({ id }, 'Task deleted successfully');
    } catch (error) {
        console.error('Error deleting task:', error);
        return sendError('Internal Server Error', ERROR_CODES.INTERNAL_ERROR, 500, error);
    }
}
