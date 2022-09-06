import { Request, Response } from 'express';
import path from 'path';
import { ProductService } from '../services/product.route';
import expressAsyncHandler from 'express-async-handler';
import readXlsxFile from 'read-excel-file/node';
import excel from 'exceljs';
import fs from 'fs';

class ProductController {
   constructor(private readonly productService: ProductService) { }

   public getProducts = expressAsyncHandler(async (req: Request, res: Response) => {
      const products = await this.productService.getProducts();

      res.status(200).send({
         status: true,
         message: "Product fetched successfully",
         data: products
      })
   })

   public createProduct = expressAsyncHandler(async (req: Request, res: Response) => {
      res.status(200).send({
         status: true,
         message: "Product Created",
         data: {}
      })
   })

   public uploadProductFromSheet = expressAsyncHandler(async (req: Request, res: Response) => {
      if (req.file === undefined) {
         res.status(400).send({
            status: false,
            message: "Please upload an excel file!"
         })

         return;
      }

      const directory_name = path.resolve();
      let file_path = directory_name + "/uploads/" + req.file.filename;
      const rows = await readXlsxFile(file_path);
      rows.shift();

      const products = [];

      rows.forEach((row) => {
         const product = {
            name: row[1],
            price: row[2],
            quantity: row[3],
            image: row[4]
         }

         products.push(product);
      });

      const createdProducts = await this.productService.createProduct(products);

      res.status(201).send({
         status: true,
         message: `Products uploaded successfully ${req.file.originalname}`,
         data: createdProducts
      })
   })

   public downloadProductPDF = expressAsyncHandler(async (req: Request, res: Response) => {
      const products = await this.productService.getProducts();
      const testFile = 'filename.xlsx';

      const product_list = [];
      products.forEach((product) => {
         product_list.push({
            id: product._id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            image: product.image
         })
      });

      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Products");
      worksheet.columns = [
         { header: "Id", key: "id", width: 5 },
         { header: "Name", key: "name", width: 25 },
         { header: "Price", key: "price", width: 25 },
         { header: "Quantity", key: "quantity", width: 10 },
         { header: "Image", key: "image", width: 25 },
      ];

      worksheet.addRows(product_list);

      const directory_name = path.resolve();
      const reportName = "report" + testFile;
      const reportPath = path.join(directory_name + "/uploads/", reportName);

      await workbook.xlsx.writeFile(reportPath);

      fs.readFile(reportPath, (error, file) => {
         if (error) {
            return console.log("Error with file download: ", [error]);
         }

         res.setHeader("Content-Type", "application/xlsx");
         res.setHeader(
            "Content-Disposition",
            `attachment; filename="${reportName}"`
         );

         res.download(reportPath)
         res.status(200)
         res.send({
            status: true,
            data: file
         });
      });
   })
}

export default new ProductController(new ProductService());