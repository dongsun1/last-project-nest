import { IsString } from 'class-validator';

export class FriendAddDto {
  @IsString()
  readonly friendUserId: string;
}
