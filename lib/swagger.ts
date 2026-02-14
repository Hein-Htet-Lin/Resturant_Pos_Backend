import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// Zod ကို OpenAPI features တွေသုံးနိုင်အောင် extend လုပ်တာပါ
extendZodWithOpenApi(z);

// ၁။ Registry ကို Export လုပ်ထားပါ (Route တွေမှာ ပြန်သုံးဖို့)
export const registry = new OpenAPIRegistry();

// ၂။ Swagger Specs ထုတ်ပေးမယ့် Function
export function getSwaggerSpecs() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Restaurant POS API',
      version: '1.0.0',
      description: 'Zod-validated API Documentation for POS System',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Development Server' }],
  });
}