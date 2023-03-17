import { IsArray, IsBoolean } from 'class-validator';

export class CreateConversationDto {
  @IsArray()
  public participants: Array<String>;
}

export class UpdateConversationDto {
  @IsArray()
  public participants: Array<String>;

  @IsBoolean()
  public isActive: boolean;
}
