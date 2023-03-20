import { IsArray, IsBoolean, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsArray()
  public participants: Array<any>;

  @IsString()
  public type: string;
}

export class UpdateConversationDto {
  @IsArray()
  public participants: Array<String>;

  @IsBoolean()
  public isActive: boolean;
}
