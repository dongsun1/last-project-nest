import { IsString } from 'class-validator';

export class FriendRemoveDto {
  @IsString()
  readonly removeUserId: string;
}