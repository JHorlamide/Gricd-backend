import mongoose, { Document } from "mongoose";
const { Schema } = mongoose;

export interface IProduct {
   name: string;
   price: string;
   quantity: string;
   image: string;
}

interface IProductModel extends Document, IProduct {
   createAt: Date;
   updatedAt: Date;
}

const productSchema = new Schema<IProductModel>({
   name: { type: String, required: true },
   price: { type: String, required: true },
   quantity: { type: String, required: true },
   image: { type: String }
}, { timestamps: true })

export default mongoose.model<IProductModel>('Product', productSchema);