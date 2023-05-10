import { IsBoolean, IsEmail, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateUserDto {
  // @IsNumber()
  // public mobile: number;

  // @IsEmail()
  // public email: string;

  @IsString()
  public username: string;

  @IsString()
  public password: string;

  @IsString()
  public name: string;

  // @IsString()
  // public firstName: string;

  // @IsString()
  // public lastName: string;

  // @IsString()
  // public birthday: string;

  // @IsObject()
  // public address: Object;

  // @IsBoolean()
  // public verifiedPhone: boolean;
}

export class UpdateUserDto {
  @IsString()
  public username: string;

  // @IsNumber()
  // public mobile: number;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public oldPassword: string;

  @IsString()
  public name: string;

  // @IsString()
  // public firstName: string;

  // @IsString()
  // public lastName: string;

  // @IsString()
  // public birthday: string;

  // @IsObject()
  // public address: Object;

  @IsBoolean()
  public isActive: boolean;

  @IsString()
  public role: string;

  // @IsObject()
  // public socialMedia: Object;

  @IsObject()
  public profilePic: Object;

  // @IsString()
  // public about: string;

  // @IsBoolean()
  // public verifiedUser: Object;
}

export class LoginUsersDto {
  @IsString()
  public username: string;

  @IsString()
  public password: string;

  // @IsNumber()
  // public mobile: number;
}

export class PasswordDto {
  @IsString()
  public password: string;
}

export class MoibileEmailDto {
  @IsNumber()
  public mobile: number;

  @IsString()
  public email: string;
}
