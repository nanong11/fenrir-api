import { IsBoolean, IsEmail, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsNumber()
  public mobile: number;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsObject()
  public address: Object;

  @IsString()
  public birthday: string;

  @IsString()
  public role: string;

  @IsBoolean()
  public isActive: boolean;

  @IsString()
  public facebook: string;

  @IsString()
  public profilePic: string;

  @IsString()
  public about: string;

  @IsBoolean()
  public verifiedPhone: boolean;

  @IsBoolean()
  public verifiedUser: boolean;
}
