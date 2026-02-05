import { prisma } from '@/lib/prisma';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ERROR_CODES } from '@/lib/errorCodes';
import { projectSchema } from '@/lib/schemas/projectSchema';
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

        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                user: {
                    select: { name: true, email: true }
                },
                tasks: true,
            },
        });

        if (!project) {
            return sendError('Project not found', ERROR_CODES.NOT_FOUND, 404);
        }

        return sendSuccess(project, 'Project fetched successfully');
    } catch (error) {
        console.error('Error fetching project:', error);
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
        const validatedData = projectSchema.partial().parse(body);

        const project = await prisma.project.update({
            where: { id },
            data: validatedData,
        });

        return sendSuccess(project, 'Project updated successfully');
    } catch (error) {
        if (error instanceof ZodError) {
            return sendError(
                'Validation Error',
                ERROR_CODES.VALIDATION_ERROR,
                400,
                formatZodError(error)
            );
        }
        console.error('Error updating project:', error);
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

        await prisma.project.delete({
            where: { id },
        });

        return sendSuccess({ id }, 'Project deleted successfully');
    } catch (error) {
        console.error('Error deleting project:', error);
        return sendError('Internal Server Error', ERROR_CODES.INTERNAL_ERROR, 500, error);
    }
}
