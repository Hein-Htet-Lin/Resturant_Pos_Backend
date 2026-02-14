import { z } from "zod";
import { registry } from "../../lib/swagger";

// OrderItem အတွက် Logic ကို သီးသန့် ထုတ်လိုက်ခြင်းဖြင့်
// နောက်ပိုင်း အော်ဒါပြင်တာ (Update Order) လုပ်တဲ့အခါ ဒီ Schema ကို ပြန်သုံးလို့ရပါတယ်
const OrderItemSchema = z.object({
    productId: z.number().int().min(1).openapi({ example: 1 }),
    quantity: z.number().int().min(1).openapi({ example: 2 }),
    notes: z.string().optional().openapi({ example: "No spicy" })
});

export const CreateOrderSchema = registry.register(
    "Order",
    z.object({
        tableId: z.number().int().min(1).openapi({ example: 1 }),
        userId: z.number().int().min(1).openapi({ example: 1 }),
        items: z.array(OrderItemSchema).min(1, "At least one item is required")
    })
);

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

// OrderItem တစ်ခုချင်းစီရဲ့ Type ကို သိချင်ရင် သုံးဖို့ (ဥပမာ- loop ပတ်တဲ့အခါ)
export type OrderItemInput = z.infer<typeof OrderItemSchema>;