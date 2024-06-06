import { Request, Response, Router } from 'express';
import prisma from '../../plugins/prisma/prisma.service';

const router = Router();


// GET /articles
// export const getArticles = async (req: Request, res: Response) => {


router.get('/articles', async (req: Request, res: Response) => {
try {
    const articles = await prisma.article.findMany();
    res.json(articles);
} catch (err) {
        res.status(500).json({ message: 'Error fetching articles', error: err });
    }
})

export default router;