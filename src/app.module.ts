import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PackingModule } from './packing/packing.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PackingModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
