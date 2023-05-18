import { IsArray, IsBoolean, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  public name: string;

  @IsArray()
  public participants: Array<any>;

  @IsString()
  public type: string;

  @IsString()
  public createdBy: string;
}

export class UpdateConversationDto {
  @IsString()
  public name: string;

  // @IsString()
  // public participantId: string;

  @IsString()
  public addedBy: string;

  @IsArray()
  public participants: Array<any>;

  @IsBoolean()
  public isActive: boolean;
}
