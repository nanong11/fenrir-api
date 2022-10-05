import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import ProvinceController from '@/controllers/province.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateProvinceDto } from '@dtos/province.dto';

class ProvinceRoute implements Routes {
  public path = '/province';
  public router = Router();
  public provinceController = new ProvinceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.provinceController.getAllProvince);
    this.router.get(`${this.path}/province`, this.provinceController.findAllProvinceOnly);
    this.router.get(`${this.path}/city/:province`, this.provinceController.findAllCityOnly);
    this.router.get(`${this.path}/brgy/:city`, this.provinceController.findAllBrgyOnly);
    this.router.get(`${this.path}/:id`, authMiddleware, this.provinceController.getProvinceById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateProvinceDto, 'body'), this.provinceController.createProvince);
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      validationMiddleware(CreateProvinceDto, 'body', true),
      this.provinceController.updateProvince,
    );
    this.router.delete(`${this.path}/:id`, authMiddleware, this.provinceController.deleteProvince);
  }
}

export default ProvinceRoute;
