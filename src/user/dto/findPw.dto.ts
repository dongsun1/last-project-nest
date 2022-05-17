import { IsString } from 'class-validator';

export class FindPwDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly userId: string;
}
