import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  public userId: string;

  // @IsObject()
  // public user: object;

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

export class UpdatePostDto {
  @IsString()
  public postId: string;

  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsString()
  public category: string;

  @IsNumber()
  public price: number;

  // @IsArray()
  // public photos: Array<object>;

  @IsBoolean()
  public active: boolean;
}

export class UpdateWishPostDto {
  @IsString()
  public postId: string;

  @IsString()
  public userId: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;
}

export class LoadPostDto {
  @IsString()
  public userId: string;

  @IsString()
  public oldestPostCreatedAt: string;

  @IsBoolean()
  public inWishlist: boolean;
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
