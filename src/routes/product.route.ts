import { Application } from 'express';
import ProductController from '../controllers/product.controller';
import uploadFile, { type } from '../middleware/upload';

export class ProductRoute {
   public routes(app: Application) {
      app.route('/api/products')
         .get(ProductController.getProducts)
         .post(ProductController.createProduct)
      app.post("/api/products/upload", [type, ProductController.uploadProductFromSheet])
      app.get("/api/products/download", ProductController.downloadProductPDF)
   }
}