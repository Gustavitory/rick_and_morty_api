import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum ECharacterStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CANCELED = 'CANCELED',
}

export class CreateCharacterDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly specie: string;

  @IsEnum(ECharacterStatus)
  @IsNotEmpty()
  readonly status: ECharacterStatus;

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
  name?: string;

  @IsString()
  @IsOptional()
  specie?: string;

  @IsEnum(ECharacterStatus)
  @IsOptional()
  status?: ECharacterStatus;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
