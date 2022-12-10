import { IsArray, IsBoolean, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  public senderId: string;

  @IsString()
  public recipientId: string;

  @IsString()
  public text: string;

  @IsArray()
  public photos: Array<object>;
}

export class UpdateMessageDto {
  @IsString()
  public text: string;

  @IsArray()
  public photos: Array<object>;

  @IsBoolean()
  public deleted: boolean;
}
