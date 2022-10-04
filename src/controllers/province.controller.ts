import { NextFunction, Request, Response } from 'express';
import { Province } from '@/interfaces/province.interface';
import ProvinceService from '@/services/province.service';
import { CreateProvinceDto } from '@dtos/province.dto';

class ProvinceController {
  public provinceService = new ProvinceService();

  public getAllProvince = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllProvince: Province[] = await this.provinceService.findAllProvince();

      res.status(200).json({ data: findAllProvince, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getProvinceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const provinceId: string = req.params.id;
      const findProvinceById: Province = await this.provinceService.findProvinceById(provinceId);

      res.status(200).json({ data: findProvinceById, message: 'findOneById' });
    } catch (error) {
      next(error);
    }
  };

  public createProvince = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const province: CreateProvinceDto = req.body;
      const createProvince: Province = await this.provinceService.createProvince(province);

      res.status(201).json({ data: createProvince, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateProvince = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const provinceId: string = req.params.id;
      const province: CreateProvinceDto = req.body;
      const updateProvince: Province = await this.provinceService.updateProvince(provinceId, province);

      res.status(200).json({ data: updateProvince, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteProvince = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const provinceId: string = req.params.id;
      const deleteProvince: Province = await this.provinceService.deleteProvince(provinceId);

      res.status(200).json({ data: deleteProvince, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default ProvinceController;
