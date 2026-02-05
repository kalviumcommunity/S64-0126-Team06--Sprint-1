import { z } from "zod";

export const projectSchema = z.object({
    name: z.string().min(2, "Project name must be at least 2 characters long"),
    description: z.string().optional().nullable(),
    userId: z.union([z.number(), z.string().regex(/^\d+$/).transform(Number)]),
});

export type ProjectInput = z.infer<typeof projectSchema>;
