import { Router } from "express";
import authController from "./auth/auth.controller"
import articleController from "./articles/article.controller"

const api = Router()
  .use(authController)
  .use(articleController)

export default Router().use('/api', api)
Router().use('/articles', articleController);