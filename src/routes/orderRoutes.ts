import { Router } from "express";
import * as orderCtrl from "../controllers/orderController";
import { CreateOrderSchema } from "../schema/orderSchema";
import { registry } from "../../lib/swagger";
import { z } from "zod";

const router = Router();
const TAG = ['Order'];

// 1. GET ALL ORDERS
registry.registerPath({
    method: 'get',
    path: '/api/orders',
    summary: 'Get All Orders',
    tags: TAG,
    responses: {
        200: {
            description: 'A list of all orders including items and table info',
            content: {
                "application/json": {
                    // ပြန်လာမယ့် schema ကို လိုသလို ပုံဖော်နိုင်ပါတယ်
                    schema: z.array(z.object({
                        id: z.number(),
                        totalAmount: z.number(),
                        status: z.enum(["OPEN", "PAID", "CANCELLED"]),
                        createdAt: z.date(),
                        tableId: z.number()
                    }))
                }
            }
        }
    }
});

// 2. CREATE NEW ORDER
registry.registerPath({
    method: "post",
    path: "/api/orders",
    summary: "Create a new Order",
    description: "Creates an order and updates the table status to OCCUPIED using a transaction.",
    tags: TAG,
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateOrderSchema
                }
            }
        }
    },
    responses: {
        201: { description: "Order created successfully" },
        400: { description: "Bad Request (e.g. Table occupied or Product not found)" }
    }
});

// 3. GET ORDER BY ID
registry.registerPath({
    method: 'get',
    path: '/api/orders/{id}',
    summary: 'Get Order by ID',
    tags: TAG,
    parameters: [
        {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
        }
    ],
    responses: {
        200: { description: 'Detailed order information' },
        404: { description: 'Order not found' }
    }
});

registry.registerPath({
    method:"get",
    path:"/api/orders/active-by-table/:tableId",
    summary:"get active table order",
    tags:TAG,
    parameters: [
        {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
        }
    ],
    responses: {
        200: { description: 'Detailed order information' },
        404: { description: 'Order not found' }
    }
})

// --- Express Routes ---
router.get('/', orderCtrl.getOrders);
router.post('/', orderCtrl.createOrder);
router.get('/:id', orderCtrl.getOrderById);
router.get("/active-by-table/:tableId",orderCtrl.getActiveOrderByTable)

export default router;