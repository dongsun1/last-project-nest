import { IsString } from 'class-validator';

export class SignUpUserDto {
  @IsString()
  readonly userId: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly userPw: string;

  @IsString()
  readonly userPwCheck: string;

  @IsString()
  readonly userNick: string;
}
