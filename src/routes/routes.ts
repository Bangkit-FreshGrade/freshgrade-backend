import { Router } from "express";
import authController from "./auth/auth.controller"
import articleController from "./articles/article.controller"
import scannerController from "./scanner/scanner.controller"

const api = Router()
  .use(authController)
  .use(articleController)
  .use(scannerController)

export default Router().use('/api', api)