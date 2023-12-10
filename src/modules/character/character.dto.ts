import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCharacterDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly specie: string;

  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @IsString()
  @IsOptional()
  readonly url?: string;
}

export class UpdateCharacterDTO {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly specie?: string;

  @IsString()
  @IsOptional()
  readonly status?: string;

  @IsString()
  @IsOptional()
  readonly url?: string;
}
