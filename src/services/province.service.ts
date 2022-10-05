import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { Province } from '@/interfaces/province.interface';
import provinceModel from '@/models/province.model';
import { CreateProvinceDto } from '@dtos/province.dto';

class ProvinceService {
  public province = provinceModel;

  public async findAllProvince(): Promise<Province[]> {
    const province: Province[] = await this.province.find();
    return province;
  }

  public async findProvinceById(provinceId: string): Promise<Province> {
    if (isEmpty(provinceId)) throw new HttpException(400, 'ProvinceId is empty');

    const findOneProvince: Province = await this.province.findOne({ _id: provinceId });
    if (!findOneProvince) throw new HttpException(409, "Province doesn't exist");

    return findOneProvince;
  }

  public async createProvince(province: CreateProvinceDto): Promise<Province> {
    if (isEmpty(province)) throw new HttpException(400, 'Province is empty');

    const findOneProvince: Province[] = await this.province.find({ brgy: province.brgy });
    if (findOneProvince) {
      findOneProvince.map(provinceInDb => {
        if (provinceInDb.province === province.province && provinceInDb.city === province.city) {
          throw new HttpException(409, `This brgy ${province.brgy} already exists`);
        }
      });
    }

    const createProvince: Province = await this.province.create({ ...province });

    return createProvince;
  }

  public async updateProvince(provinceId: string, province: CreateProvinceDto): Promise<Province> {
    if (isEmpty(province)) throw new HttpException(400, 'Province is empty');

    const updateProvinceById: Province = await this.province.findByIdAndUpdate(provinceId, province, { new: true });
    if (!updateProvinceById) throw new HttpException(409, "Province doesn't exist");

    return updateProvinceById;
  }

  public async findAllProvinceOnly(): Promise<Province[]> {
    const findAllProvinceOnly: Province[] = await this.province.aggregate([
      {
        $group: { _id: '$province' },
      },
      { $sort: { _id: 1 } },
    ]);

    return findAllProvinceOnly;
  }

  public async findAllCityOnly(province: string): Promise<Province[]> {
    const findAllProvinceOnly: Province[] = await this.province.aggregate([
      { $match: { province: province } },
      {
        $group: { _id: '$city' },
      },
      { $sort: { _id: 1 } },
    ]);

    return findAllProvinceOnly;
  }

  public async findAllBrgyOnly(city: string): Promise<Province[]> {
    const findAllProvinceOnly: Province[] = await this.province.aggregate([
      { $match: { city: city } },
      {
        $group: { _id: '$brgy' },
      },
      { $sort: { _id: 1 } },
    ]);

    return findAllProvinceOnly;
  }

  public async deleteProvince(provinceId: string): Promise<Province> {
    const deleteProvinceById: Province = await this.province.findByIdAndDelete(provinceId);
    if (!deleteProvinceById) throw new HttpException(409, "Province doesn't exist");

    return deleteProvinceById;
  }
}

export default ProvinceService;
