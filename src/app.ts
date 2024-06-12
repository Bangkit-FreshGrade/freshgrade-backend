import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import routes from "./routes/routes";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json())

app.use(routes)

app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})