import { z } from "zod";

export const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional().nullable(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
    priority: z.string().optional().nullable(),
    dueDate: z.union([z.date(), z.string().datetime(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]).optional().nullable().transform(val => val ? new Date(val) : val),
    projectId: z.union([z.number(), z.string().regex(/^\d+$/).transform(Number)]),
    assignedToUserId: z.union([z.number(), z.string().regex(/^\d+$/).transform(Number)]).optional().nullable(),
});

export type TaskInput = z.infer<typeof taskSchema>;
