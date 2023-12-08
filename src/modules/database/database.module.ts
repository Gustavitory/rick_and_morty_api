import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import config from 'src/env/config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        const pass = configService.PASSWORD_DB;
        console.log('content: ', pass);
        const host = configService.DB_HOST;
        const port = configService.DB_PORT;
        const name = configService.DB_NAME;
        const user = configService.USER_DB;
        return {
          uri: `mongodb://${user}:${pass}@${host}:${port}/${name}?authSource=admin`,
        };
      },
      inject: [config.KEY],
    }),
  ],
})
export class DatabaseModule {}
