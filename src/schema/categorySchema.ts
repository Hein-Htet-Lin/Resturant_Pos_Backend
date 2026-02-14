import { z } from 'zod';
import { registry } from '../../lib/swagger';

export const CreateCategorySchema = registry.register(
  'CreateCategory',
  z.object({
    name: z.string().min(1, "Category name is required").openapi({ example: 'Drinks' }),
  })
);

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;