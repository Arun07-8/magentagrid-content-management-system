import { z } from 'zod';

function countWords(str: string): number {
  const trimmed = str.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export const createPostSchema = z.object({
  title: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: 'Title is required' })
    .refine((val) => val.length >= 5, { message: 'Title must be at least 5 characters' })
    .refine((val) => val.length <= 100, { message: 'Title cannot exceed 100 characters' }),
  description: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: 'Short description is required' })
    .refine((val) => val.length >= 20, { message: 'Short description must be at least 20 characters' })
    .refine((val) => val.length <= 300, { message: 'Short description cannot exceed 300 characters' }),
  content: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: 'Main content is required' })
    .refine((val) => countWords(val) >= 150, {
      message: 'Main content must be at least 150 words',
    })
    .refine((val) => countWords(val) <= 500, {
      message: 'Main content cannot exceed 500 words',
    }),
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
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: 'Title is required' })
    .refine((val) => val.length >= 5, { message: 'Title must be at least 5 characters' })
    .refine((val) => val.length <= 100, { message: 'Title cannot exceed 100 characters' })
    .optional(),
  description: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: 'Short description is required' })
    .refine((val) => val.length >= 20, { message: 'Short description must be at least 20 characters' })
    .refine((val) => val.length <= 300, { message: 'Short description cannot exceed 300 characters' })
    .optional(),
  content: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: 'Main content is required' })
    .refine((val) => countWords(val) >= 150, {
      message: 'Main content must be at least 150 words',
    })
    .refine((val) => countWords(val) <= 500, {
      message: 'Main content cannot exceed 500 words',
    })
    .optional(),
  imageUrl: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === null ? '' : val)),
  status: z.enum(['Draft', 'Published']).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
