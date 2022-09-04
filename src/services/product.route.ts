import ProductModel, { IProduct } from "../models/product.model";

export class ProductService {
   async createProduct(productBodyField: IProduct | IProduct[]) {
      return ProductModel.create(productBodyField)
   }

   async getProducts() {
      return await ProductModel.find({}).exec();
   }
}