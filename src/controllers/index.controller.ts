import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json('Welcome to Andvari Server! This server is use for Andvari website only!');
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
