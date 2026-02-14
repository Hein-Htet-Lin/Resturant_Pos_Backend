import {z} from 'zod'
import { registry } from '../../lib/swagger'

export const TableStatusEnum = z.enum(["AVAILABLE", "OCCUPIED", "RESERVED"]);
export const CreateTableSchema = registry.register(
    "table",
    z.object({
        id: z.number().optional(),
        tableNumber: z.string()
            .min(1, "Table number is required")
            .openapi({ example: "T-01" }),
        status: TableStatusEnum
            .default("AVAILABLE")
            .openapi({ example: "AVAILABLE" }),
        capacity: z.number()
            .int()
            .min(1)
            .default(4)
            .openapi({ example: 4 }),
    })
)

export type CreateTableInput = z.infer<typeof CreateTableSchema>;

// Update အတွက် Partial Schema
export const UpdateTableSchema = CreateTableSchema.partial();