import { prisma } from '@/lib/prisma';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ERROR_CODES } from '@/lib/errorCodes';
import { projectSchema } from '@/lib/schemas/projectSchema';
import { ZodError } from 'zod';
import { formatZodError } from '@/lib/zodErrorHandler';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get('page')) || 1;
        const limit = Number(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        const projects = await prisma.project.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        });

        const total = await prisma.project.count();

        return sendSuccess({
            data: projects,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        }, 'Projects fetched successfully');
    } catch (error) {
        console.error('Error fetching projects:', error);
        return sendError('Internal Server Error', ERROR_CODES.INTERNAL_ERROR, 500, error);
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = projectSchema.parse(body);

        const project = await prisma.project.create({
            data: validatedData,
        });

        return sendSuccess(project, 'Project created successfully', 201);
    } catch (error) {
        if (error instanceof ZodError) {
            return sendError(
                'Validation Error',
                ERROR_CODES.VALIDATION_ERROR,
                400,
                formatZodError(error)
            );
        }
        console.error('Error creating project:', error);
        return sendError('Internal Server Error', ERROR_CODES.INTERNAL_ERROR, 500, error);
    }
}
