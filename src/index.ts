import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { getSwaggerSpecs } from '../lib/swagger'; // အရှေ့မှာ ပြောခဲ့တဲ့ swagger config
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes';
import tableRoutes from "./routes/tableRoutes"
import orderRoutes from "./routes/orderRoutes"
// Routes တွေကို နောက်မှ ဒီမှာ လာချိတ်ပါမယ်
// import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware များ
app.use(helmet()); // Security အတွက်
app.use(cors());   // Frontend ကနေ ခေါ်ယူခွင့်ပေးရန်
app.use(express.json()); // JSON data တွေကို ဖတ်နိုင်ရန်

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(getSwaggerSpecs()));

// အခြေခံ ကျန်းမာရေးစစ်ဆေးချက် Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Restaurant POS Server is running' });
});

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/orders",orderRoutes)
// Server စတင်နှိုးခြင်း
app.listen(PORT, () => {
  console.log(`
  🚀 Server is running!
  📡 URL: http://localhost:${PORT}
  📖 Docs: http://localhost:${PORT}/api-docs
  `);
});