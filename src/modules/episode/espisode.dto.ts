import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEpisodeDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  status: 'ACTIVE' | 'SUSPENDED' | 'CANCELED';

  @IsNumber()
  @IsNotEmpty()
  season: number;

  @IsString()
  @IsNotEmpty()
  duration: string;

  participation: {
    userId: string;
    participations?: {
      init: string;
      finish: string;
    }[];
  }[];
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

  @IsString()
  @IsOptional()
  status?: 'ACTIVE' | 'SUSPENDED' | 'CANCELED';

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
