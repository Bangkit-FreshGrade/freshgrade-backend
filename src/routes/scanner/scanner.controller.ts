import { Request, Response, Router } from "express";
import * as ScannerService from "./scanner.service"
import authVerification from "../../common/guard/at.guard";
import multer from "multer"

const router = Router();
const upload = multer();

router.post('/predict', authVerification, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const image = req.file

    if (!image) {
      return res.status(400).json({
        code: 400,
        message: "No image detected"
      })
    }
    
    const result = await ScannerService.postPredict(image)
    // TODO: handle predict result
  } catch (error: any) {
    res.status(error.errorCode).json({
      code: error.errorCode,
      message: error.message
    })
  }
})

export default router