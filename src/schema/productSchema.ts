import {z} from "zod"
import { registry } from "../../lib/swagger"


export const CreateProductSchema = registry.register(
    "product",
    z.object({
        id:z.number().optional(),
        name:z.string().min(1,"Product Name is required").openapi({example:"Iced Latte"}),
        price:z.number().min(0).openapi({example:4500}),
        categoryId:z.number().openapi({example:1})
    })
)

export type CreateProductInput = z.infer<typeof CreateProductSchema>;

