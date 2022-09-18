import { IsNumber, IsString } from 'class-validator';

export class LoginUsersDto {
  @IsString()
  public email: string;

  @IsString()
  public password: string;

  @IsNumber()
  public mobile: number;
}
