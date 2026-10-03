import { z } from 'zod';

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Short description is required')
    .max(500, 'Description cannot exceed 500 characters'),
  content: z
    .string()
    .min(1, 'Main content is required'),
  imageUrl: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val ?? ''),
  status: z.enum(['Draft', 'Published']).optional().default('Draft'),
});


export const updatePostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title cannot exceed 200 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .min(1, 'Short description cannot be empty')
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  content: z.string().min(1, 'Main content cannot be empty').optional(),
  imageUrl: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === null ? '' : val)),
  status: z.enum(['Draft', 'Published']).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
