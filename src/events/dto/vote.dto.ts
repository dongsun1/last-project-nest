import { IsString } from 'class-validator';

export class VoteDto {
  @IsString()
  readonly clickerJob: string;

  @IsString()
  readonly clickerId: string;

  @IsString()
  readonly clickedId: string;
}
