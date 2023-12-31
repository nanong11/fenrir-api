import { IsString } from 'class-validator';

export class CreateProvinceDto {
  @IsString()
  public province: string;

  @IsString()
  public city: string;

  @IsString()
  public brgy: string;

  @IsString()
  public region: string;
}

export class FindCityDto {
  @IsString()
  public province: string;
}

export class FindBrgyDto {
  @IsString()
  public city: string;
}
