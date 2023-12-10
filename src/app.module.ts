import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from '@nestjs/config';
import config from './env/config';
import validations from './env/validations';
import { enviroments } from './env/enviroment';
import { RickAndMortyApiService } from './external-services/rick-and-morty-api/rick-and-morty-api.service';
import { CharacterModule } from './modules/character/character.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      validationSchema: validations,
    }),
    DatabaseModule,
    CharacterModule,
  ],
  controllers: [AppController],
  providers: [AppService, RickAndMortyApiService],
})
export class AppModule {}
