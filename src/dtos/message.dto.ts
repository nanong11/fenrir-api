import { IsArray, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  public userId: string;

  @IsString()
  public conversationId: string;

  @IsString()
  public text: string;

  @IsArray()
  public media: Array<object>;
}

export class UpdateMessageDto {
  @IsString()
  public text: string;

  @IsArray()
  public media: Array<object>;

  @IsString()
  public status: string;

  @IsArray()
  public removed: Array<object>;
}
