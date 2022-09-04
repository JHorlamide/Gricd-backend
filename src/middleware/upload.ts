import { Request } from "express";
import multer from "multer";
import path from 'path'

const storage = multer.diskStorage({
   destination: (req: Request, file: any, cb: Function) => {
      cb(null, "./uploads")
   },

   filename: (req: Request, file: any, cb: Function) => {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
   }
});

const checkFileType = (req: Request, file: any, cb: Function) => {
   const fileTypes = /xlsx|excel|spreadsheetml/;
   const fileExtName = fileTypes.test(path.extname(file.originalname).toLowerCase());
   const mimetype = fileTypes.test(file.mimetype);

   if (fileExtName && mimetype) {
      return cb(null, true);
   }

   cb("Please upload only excel file.", false)
}

const upload = multer({
   storage,
   fileFilter: function(req, file, cb) {
      checkFileType(req, file, cb)
   }
})

export const type = upload.single('file')

export default upload;