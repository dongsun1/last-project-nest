import { IsString } from 'class-validator';

export class FriendUserDto {
  @IsString()
  readonly friendUser: string;
}
