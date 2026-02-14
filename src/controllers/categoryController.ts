import type { Request, Response } from 'express';
import {prisma} from '../../lib/prisma';
import { CreateCategorySchema } from '../schema/categorySchema';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const validatedData = CreateCategorySchema.parse(req.body);
    const category = await prisma.category.create({
      data: validatedData,
    });
    res.status(201).json(category);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    include: { products: true } // Category နဲ့အတူ product တွေပါ တစ်ခါတည်း ဆွဲထုတ်မယ်
  });
  res.json(categories);
};

// Get Single Category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: { 
        products: true // ဒီ Category ထဲမှာရှိတဲ့ Product တွေကိုပါ တစ်ခါတည်း ဆွဲထုတ်မယ်
      }
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Category
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updated = await prisma.category.update({
      where: { id: Number(id) },
      data: { name }
    });
    res.json(updated);
  } catch (error) {
    res.status(404).json({ error: "Category not found" });
  }
};

// Delete Category
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: "Category not found or has products" });
  }
};