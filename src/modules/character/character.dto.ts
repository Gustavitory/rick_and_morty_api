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
  readonly status: 'ACTIVE' | 'SUSPENDED' | 'CANCELED';

  @IsString()
  @IsOptional()
  readonly url?: string;

  @IsString()
  @IsNotEmpty()
  readonly state: string;

  @IsString()
  @IsNotEmpty()
  readonly gender: string;
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
  readonly status?: 'ACTIVE' | 'SUSPENDED' | 'CANCELED';

  @IsString()
  @IsOptional()
  readonly url?: string;

  @IsString()
  @IsOptional()
  readonly state?: string;

  @IsString()
  @IsOptional()
  readonly gender?: string;

  @IsString()
  @IsOptional()
  readonly image?: string;
}
