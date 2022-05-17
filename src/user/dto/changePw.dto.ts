import { IsString } from 'class-validator';

export class ChangePwDto {
  @IsString()
  readonly userId: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly newPw: string;

  @IsString()
  readonly newPwCheck: string;
}
