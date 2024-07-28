import { Request, NextFunction, Response } from 'express'

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
    res.status(404).json({ message: 'Resource not found' })
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  };