import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const schema = z.object({
    PORT: z.coerce.number().default(5000),

    JWT_ACCESS_SECRET: z
        .string()
        .min(16, 'JWT_ACCESS_SECRET must be at least 16 characters'),

    JWT_REFRESH_SECRET: z
        .string()
        .min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),

    ACCESS_TOKEN_TTL: z.string().default('15m'),

    REFRESH_TOKEN_TTL_DAYS: z.coerce.number().default(7),

    MONGODB_URI: z
        .string()
        .min(1, 'MONGODB_URI is required'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
    console.error('\nInvalid environment configuration:');

    for (const issue of parsed.error.issues) {
        console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }

    process.exit(1);
}

export const env = parsed.data;