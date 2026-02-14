import type{ Request, Response } from 'express';
import {prisma} from '../../lib/prisma';
import { CreateOrderSchema } from '../schema/orderSchema.js';

// ၁။ အော်ဒါအသစ်တင်ခြင်း (Create Order)
export const createOrder = async (req: Request, res: Response) => {
    try {
        const validatedData = CreateOrderSchema.parse(req.body);
        const { tableId, userId, items } = validatedData;

        // Transaction သုံးပြီး Database အလုပ်တွေကို တစ်စုတစ်စည်းတည်း လုပ်မယ်
        const result = await prisma.$transaction(async (tx) => {
            let total = 0;

            // ဟင်းပွဲတစ်ခုချင်းစီအတွက် ဈေးနှုန်းတွက်ချက်မယ်
            const orderItemsDetail = [];
            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                });

                if (!product) throw new Error(`Product with ID ${item.productId} not found`);

                total += product.price * item.quantity;

                orderItemsDetail.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    notes: item.notes || ""
                });
            }

            // Order ဆောက်မယ်
            const order = await tx.order.create({
                data: {
                    tableId,
                    userId,
                    totalAmount: total,
                    status: 'OPEN',
                    items: {
                        create: orderItemsDetail
                    }
                },
                include: { items: true }
            });

            // Table Status ကို အော်တို ပြောင်းမယ်
            await tx.table.update({
                where: { id: tableId },
                data: { status: 'OCCUPIED' }
            });

            return order;
        });

        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// ၂။ အော်ဒါအားလုံးကို ကြည့်ခြင်း (Read All Orders)
export const getOrders = async (_req: Request, res: Response) => {
    const orders = await prisma.order.findMany({
        include: { items: { include: { product: true } }, table: true, user: true },
        orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
};

// ၃။ အော်ဒါတစ်ခုချင်းစီကို အသေးစိတ်ကြည့်ခြင်း (Read Single Order)
export const getOrderById = async (req: Request, res: Response) => {
    const order = await prisma.order.findUnique({
        where: { id: Number(req.params.id) },
        include: { items: { include: { product: true } }, table: true }
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
};

// ၄။ အော်ဒါ ပယ်ဖျက်ခြင်း (Delete Order)
export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const orderId = Number(req.params.id);
        
        await prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({ where: { id: orderId } });
            if (!order) throw new Error("Order not found");

            // OrderItems အရင်ဖျက်မယ်
            await tx.orderItem.deleteMany({ where: { orderId } });
            // Order ဖျက်မယ်
            await tx.order.delete({ where: { id: orderId } });
            // စားပွဲကို ပြန်အားအောင်လုပ်မယ် (Optional - logic ပေါ်မူတည်တယ်)
            await tx.table.update({ where: { id: order.tableId }, data: { status: 'AVAILABLE' } });
        });

        res.json({ message: "Order deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};


// GET /api/orders/active-by-table/:tableId
export const getActiveOrderByTable = async (req:Request, res:Response) => {
  const { tableId } = req.params;

  try {
    const activeOrder = await prisma.order.findFirst({
      where: {
        tableId: Number(tableId),
        status: {
          not: 'PAID', // PAID မဟုတ်တဲ့ (OPEN, PENDING) order ကို ရှာတာပါ
        },
      },
      include: {
        items: {
          include: {
            product: true, // Item တွေနဲ့အတူ Product details တွေကိုပါ တစ်ခါတည်း ယူမယ်
          },
        },
      },
    });

    // အော်ဒါမရှိရင် null ပြန်မယ်
    res.json(activeOrder);
  } catch (error) {
    res.status(500).json({ message: "Error fetching active order" });
  }
};
