import { Request, Response, Router, NextFunction } from "express";
import * as ScannerService from "./scanner.service"
import authVerification from "../../common/guard/at.guard";
import multer from "multer"
import HttpException from "../../model/http-exception.model";

const router = Router();

const multerStorage = multer.memoryStorage();
const upload = multer({
    storage: multerStorage,
    limits: { fileSize: 1 * 1024 * 1024 }, 
});

const imageUpload = upload.single('image')
const imageSizeHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      code: 400,
      message: "File size should be less than 1 MB"
    });
  }
  next(err);
}

router.post('/predict', authVerification, async (req: Request, res: Response, next: NextFunction) => {
  imageUpload(req, res, (err: any) => {
    if (err) {
      return imageSizeHandler(err, req, res, next)
    }

    next()
  })
  }, async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    const image = req.file

    if (!image) {
      return res.status(400).json({
        code: 400,
        message: "No image detected"
      })
    }
    
    const allowedImageTypes = [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/gif',
    ];

    if(!allowedImageTypes.includes(image.mimetype)) {
      throw new HttpException(400, "Only image files (JPG/JPEG/PNG/GIF) are allowed")
    }

    const result = await ScannerService.postPredict(userId, image)
    // TODO: handle predict result
    res.json(result)
  } catch (error: any) {
    res.status(error.errorCode).json({
      code: error.errorCode,
      message: error.message
    })
  }
})

export default router