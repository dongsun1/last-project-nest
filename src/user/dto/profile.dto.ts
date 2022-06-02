import { IsString } from 'class-validator';

export class ProfileDto {
  @IsString()
  readonly userProfile: Number;
}
