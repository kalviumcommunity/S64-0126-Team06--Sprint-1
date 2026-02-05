import { prisma } from '@/lib/prisma';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ERROR_CODES } from '@/lib/errorCodes';
import { userSchema } from '@/lib/schemas/userSchema';
import { ZodError } from 'zod';
import { formatZodError } from '@/lib/zodErrorHandler';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number(params.id);
        if (isNaN(id)) {
            return sendError('Invalid ID', ERROR_CODES.VALIDATION_ERROR, 400);
        }

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                projects: true,
                tasks: true,
            },
        });

        if (!user) {
            return sendError('User not found', ERROR_CODES.NOT_FOUND, 404);
        }

        return sendSuccess(user, 'User fetched successfully');
    } catch (error) {
        console.error('Error fetching user:', error);
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
        // Use partial() for updates so fields are optional
        const validatedData = userSchema.partial().parse(body);

        const user = await prisma.user.update({
            where: { id },
            data: validatedData,
        });

        return sendSuccess(user, 'User updated successfully');
    } catch (error) {
        if (error instanceof ZodError) {
            return sendError(
                'Validation Error',
                ERROR_CODES.VALIDATION_ERROR,
                400,
                formatZodError(error)
            );
        }
        console.error('Error updating user:', error);
        // Handle unique constraint error for email
        if ((error as any).code === 'P2002') {
            return sendError('User with this email already exists', ERROR_CODES.VALIDATION_ERROR, 400);
        }
        return sendError('Internal Server Error', ERROR_CODES.INTERNAL_ERROR, 500, error);
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number(params.id);
        if (isNaN(id)) {
            return sendError('Invalid ID', ERROR_CODES.VALIDATION_ERROR, 400);
        }

        await prisma.user.delete({
            where: { id },
        });

        return sendSuccess({ id }, 'User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        return sendError('Internal Server Error', ERROR_CODES.INTERNAL_ERROR, 500, error);
    }
}
