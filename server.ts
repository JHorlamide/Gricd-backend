import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { ProductRoute } from './src/routes/product.route';
import { connectDatabase } from './src/config/db.config'

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* File upload config */
let directory_name = path.resolve();
app.use('/uploads', express.static(path.join(directory_name, '/uploads')));

const productRoute = new ProductRoute();
productRoute.routes(app);

connectDatabase();

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}...`)
})