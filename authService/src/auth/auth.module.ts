import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Photo } from '../client/entities/photo.entity';
import { Client } from '../client/entities/client.entity';
import { ClientModule } from '../client/client.module';
import { ClientService } from '../client/client.service';
import { AwsService } from '../aws/aws.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo, Client]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow('JWT_EXPIRES'),
        },
      }),
    }),
    ClientModule,
  ],
  providers: [AuthService, ClientService, AwsService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
