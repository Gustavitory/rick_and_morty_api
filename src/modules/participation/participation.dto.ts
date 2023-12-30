import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export type TParticipations = {
  init: string;
  finish: string;
};

export class CreateParticipationDTO {
  @IsString()
  @IsNotEmpty()
  readonly character: string;

  @IsString()
  @IsNotEmpty()
  readonly episode: string;

  @IsNotEmpty()
  times: TParticipations;
}

export class UpdateParticipationDTO {
  @IsString()
  @IsOptional()
  character?: string;

  @IsString()
  @IsOptional()
  episode?: string;

  @IsOptional()
  times?: TParticipations[];
}
