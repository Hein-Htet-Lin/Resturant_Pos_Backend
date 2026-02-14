import {Router} from "express"
import * as productCtrl from "../controllers/productController"
import { registry } from "../../lib/swagger"
import { CreateProductSchema } from "../schema/productSchema"
import {z} from "zod"

const router =Router();
const TAG = ["Product"]


// --- Swagger Documentation ---

// 1. GET ALL
registry.registerPath({
    method: 'get',
    path:'/api/products',
    summary:'get all products',
    tags:TAG,
    responses:{
        200:{
            description:'A list of product with their categories',
            content:{"application/json":{schema:z.array(CreateProductSchema.extend({id:z.number()}))}}
        }
    }
})

// 2. CREATE PRODUCT
registry.registerPath({
  method: 'post',
  path: '/api/products',
  summary: 'Create a new product',
  tags: TAG,
  request: { body: { content: { 'application/json': { schema: CreateProductSchema } } } },
  responses: { 201: { description: 'Created' } },
});

// 3. GET BY PRODUCTID
registry.registerPath({
    method:"get",
    path:'/api/products/{id}',
    summary:'Get single Product By Id',
    tags:TAG,
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
  responses: {
    200: { description: 'Product found' },
    404: { description: 'Product not found' },
  },
})

// 3. UPDATE RODUCT
registry.registerPath({
    method:"post",
    path:'/api/products/{id}',
    summary:'Update Product',
    tags:TAG,
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    request: {
    body: { content: { 'application/json': { schema: CreateProductSchema } } }
  },
  responses: {
    200: { description: 'Product Udated' },
    // 404: { description: 'Category not found' },
  },
})


// --- Express Routes ---
router.get('/',productCtrl.getProducts);
router.post('/',productCtrl.createProduct);
router.get("/:id",productCtrl.getProductById)
router.post('/:id',productCtrl.updateProduct)

export default router;
