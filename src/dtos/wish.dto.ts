import { IsString } from 'class-validator';
export class UpdateWishPostDto {
  @IsString()
  public userId: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;
}
