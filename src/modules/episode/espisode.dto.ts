import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum StatusEnum {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CANCELED = 'CANCELED',
}

export class CreateEpisodeDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(StatusEnum)
  @IsNotEmpty()
  status: StatusEnum;

  @IsNumber()
  @IsNotEmpty()
  season: number;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsString()
  @IsNotEmpty()
  air_date: string;

  @IsString()
  @IsNotEmpty()
  episode: string;
}

export class EditEpisodeDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;

  @IsNumber()
  @IsOptional()
  season?: number;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  air_date?: string;

  @IsString()
  @IsOptional()
  episode?: string;
}
