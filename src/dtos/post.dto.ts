import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  public userId: string;

  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsString()
  public category: string;

  @IsNumber()
  public price: number;

  @IsArray()
  public photos: Array<object>;
}
