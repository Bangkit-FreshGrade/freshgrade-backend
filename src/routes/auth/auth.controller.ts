import { Request, Response, Router } from "express";
import * as AuthService from "./auth.service";
import authVerification from "../../common/guard/at.guard";

const router = Router();

/**
 * Register an user
 */
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const user = await AuthService.createUser({ ...req.body});
    res.json(user)
  } catch (error: any) {
    res.status(error.errorCode).json({
      code: error.errorCode,
      message: error.message
    })
  }
})

/**
 * Login
 */
router.post('/signin', async (req: Request, res: Response) => {
  try {
    const tokens = await AuthService.login({ ...req.body});
    res.json(tokens)
  } catch (error: any) {
    res.status(error.errorCode).json({
      code: error.errorCode,
      message: error.message
    })
  }
})

/**
 * Get User Details
 */
router.get('/user', authVerification, async (req: Request, res: Response) => {
  const userId = req.params.id
  if (!userId) {
    return res.status(401).json({
      code: 401,
      message: "Unauthorized"
    })
  }

  try {
    const user = await AuthService.getUserDetails(userId)
    res.json(user)
  } catch (error: any) {
    res.status(error.errorCode).json({
      code: error.errorCode,
      message: error.message
    })
  }
})

export default router;