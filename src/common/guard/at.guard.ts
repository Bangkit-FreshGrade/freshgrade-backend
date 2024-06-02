import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../../types/jwtPayload.type';

const authVerification = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      code: 401,
      message: "Unauthorized"
    })
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      code: 401,
      message: "Unauthorized"
    })
  }

  const at = process.env.AT_SECRET
  if (!at) {
    return res.status(500).json({
      code: 500,
      message: "Secret key not found"
    })
  }

  jwt.verify(token, at , (err, decodedToken) => {
    if (err) {
      return res.status(403).json({
        code: 403,
        message: "Forbidden access"
      })
    }
    
    const { id } = decodedToken as JwtPayload

    req.params.id = id

    next();
  });
};

export default authVerification;
