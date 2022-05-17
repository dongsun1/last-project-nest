import { IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  readonly roomTitle: string;

  @IsString()
  readonly roomPeople: string;

  @IsString()
  readonly roomPwd: string;
}
