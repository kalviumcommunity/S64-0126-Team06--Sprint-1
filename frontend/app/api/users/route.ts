import { prisma } from '@/lib/prisma';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ERROR_CODES } from '@/lib/errorCodes';
import { userSchema } from '@/lib/schemas/userSchema';
import { ZodError } from 'zod';
import { formatZodError } from '@/lib/zodErrorHandler';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get('page')) || 1;
        const limit = Number(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        const users = await prisma.user.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        const total = await prisma.user.count();

        return sendSuccess({
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        }, 'Users fetched successfully');
    } catch (error) {
        console.error('Error fetching users:', error);
        return sendError('Internal Server Error', ERROR_CODES.INTERNAL_ERROR, 500, error);
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = userSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return sendError('User with this email already exists', ERROR_CODES.VALIDATION_ERROR, 400);
        }

        const user = await prisma.user.create({
            data: validatedData,
        });

        return sendSuccess(user, 'User created successfully', 201);
    } catch (error) {
        if (error instanceof ZodError) {
            return sendError(
                'Validation Error',
                ERROR_CODES.VALIDATION_ERROR,
                400,
                formatZodError(error)
            );
        }
        console.error('Error creating user:', error);
        return sendError('Internal Server Error', ERROR_CODES.INTERNAL_ERROR, 500, error);
    }
}
