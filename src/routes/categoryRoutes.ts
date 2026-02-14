// import { Router } from 'express';
// import { createCategory, getCategories } from '../controllers/categoryController.js';
// import { registry } from '../../lib/swagger.js';
// import { CreateCategorySchema } from '../schema/categorySchema.js';

// const router = Router();

// // Swagger Documentation for GET
// registry.registerPath({
//   method: 'get',
//   path: '/api/categories',
//   summary: 'Get all categories',
//   responses: { 200: { description: 'Success' } },
// });

// // Swagger Documentation for POST
// registry.registerPath({
//   method: 'post',
//   path: '/api/categories',
//   summary: 'Create a new category',
//   request: {
//     body: { content: { 'application/json': { schema: CreateCategorySchema } } },
//   },
//   responses: { 201: { description: 'Created' } },
// });

// router.get('/', getCategories);
// router.post('/', createCategory);

// export default router;
import { Router } from 'express';
import * as categoryCtrl from '../controllers/categoryController.js';
import { registry } from '../../lib/swagger.js';
import { CreateCategorySchema } from '../schema/categorySchema.js';
import { z } from 'zod';

const router = Router();
const TAG = ['Category']; // Swagger မှာ Category အုပ်စုထဲ ထည့်ရန်

// --- Swagger Documentation ---

// 1. GET ALL
registry.registerPath({
  method: 'get',
  path: '/api/categories',
  summary: 'Get all categories',
  tags: TAG,
  responses: {
    200: {
      description: 'A list of categories with their products',
      content: { 'application/json': { schema: z.array(CreateCategorySchema.extend({ id: z.number() })) } },
    },
  },
});

// 2. GET BY ID
registry.registerPath({
  method: 'get',
  path: '/api/categories/{id}',
  summary: 'Get a single category',
  tags: TAG,
  parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
  responses: {
    200: { description: 'Category found' },
    404: { description: 'Category not found' },
  },
});

// 3. CREATE
registry.registerPath({
  method: 'post',
  path: '/api/categories',
  summary: 'Create a new category',
  tags: TAG,
  request: {
    body: { content: { 'application/json': { schema: CreateCategorySchema } } },
  },
  responses: {
    201: { description: 'Created successfully' },
    400: { description: 'Invalid input' },
  },
});

// 4. UPDATE
registry.registerPath({
  method: 'put',
  path: '/api/categories/{id}',
  summary: 'Update a category',
  tags: TAG,
  parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
  request: {
    body: { content: { 'application/json': { schema: CreateCategorySchema } } },
  },
  responses: {
    200: { description: 'Updated successfully' },
    404: { description: 'Category not found' },
  },
});

// 5. DELETE
registry.registerPath({
  method: 'delete',
  path: '/api/categories/{id}',
  summary: 'Delete a category',
  tags: TAG,
  parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
  responses: {
    204: { description: 'Deleted successfully' },
    404: { description: 'Category not found' },
  },
});

// --- Express Routes ---

router.get('/', categoryCtrl.getCategories);
router.get('/:id', categoryCtrl.getCategoryById);
router.post('/', categoryCtrl.createCategory);
router.put('/:id', categoryCtrl.updateCategory);
router.delete('/:id', categoryCtrl.deleteCategory);

export default router;