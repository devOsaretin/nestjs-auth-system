import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from '../client/entities/photo.entity';
import { Client } from '../client/entities/client.entity';
import { ClientModule } from '../client/client.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Photo, Client]), ClientModule],
  providers: [],
  controllers: [AuthController],
})
export class AuthModule {}
