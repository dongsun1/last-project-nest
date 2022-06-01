import { IsString } from 'class-validator';

export class RemoveUserDto {
  @IsString()
  readonly removeUser: string;
}
