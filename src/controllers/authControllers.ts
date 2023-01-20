import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { apiKey } = req.query;
    const user = await prisma.user.findUnique({
      where: { apiKey: apiKey as string },
    });
    if (!user)
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    req.user = user;
    next();
  } catch (error) {
    console.log(
      '🚀 ~ file: authMiddleware.ts ~ line 16 ~ protect ~ error',
      error
    );
    if (error instanceof Error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};
