import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

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

export class UpdateWishPostDto {
  @IsString()
  public userId: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;
}

export class SearchPostDto {
  @IsString()
  public userId: string;

  @IsString()
  public oldestPostCreatedAt: string;

  @IsString()
  public keyWord: string;

  @IsBoolean()
  public inWishlist: boolean;
}
