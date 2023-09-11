import { RegisterClientDto } from './../client/dto/register-client.dto';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ClientService } from '../client/client.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsService } from '../aws/aws.service';
import { Repository } from 'typeorm';
import { Photo } from '../client/entities/photo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from '../client/entities/client.entity';

import * as bcrypt from 'bcrypt';
import {
  fakeHashPassword,
  fakeToken,
  mockClient,
  mockFiles,
} from '../../test/mockData/mock.data';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let mockClientService: Partial<ClientService>;
  let mockAwsService: Partial<AwsService>;
  let photoRepository: Repository<Photo>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const fakeClients: Client[] = [];
    mockClientService = {
      findByEmail: (email) => {
        const client = fakeClients.find((client) => client.email === email);
        return Promise.resolve(client);
      },
      findOne: (id) => {
        const filterClient = fakeClients.find((client) => client.id === id);
        return Promise.resolve(filterClient);
      },
      find: () => Promise.resolve(fakeClients),
      create: (data) => {
        const newClient = {
          ...data,
          id: Math.floor(Math.random() * 999999),
        };
        fakeClients.push(newClient as Client);
        return Promise.resolve(newClient as Client);
      },
    };
    mockAwsService = {
      upload: (filename: string, buffer: Buffer) =>
        Promise.resolve({ url: 'fake.aws.s3.com', name: filename }),
    };

    const mockRepositoryMethods = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
      ],
      providers: [
        ConfigService,
        AuthService,
        {
          provide: AwsService,
          useValue: { ...mockAwsService },
        },
        {
          provide: ClientService,
          useValue: mockClientService,
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
        {
          provide: getRepositoryToken(Photo),
          useValue: { ...mockRepositoryMethods },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    photoRepository = module.get<Repository<Photo>>(getRepositoryToken(Photo));
    jwtService = module.get<JwtService>(JwtService);
  });

  beforeEach(async () => {
    (bcrypt.hash as jest.Mock).mockImplementation(() => {
      return Promise.resolve(fakeHashPassword);
    });

    (bcrypt.compare as jest.Mock).mockImplementation(() => {
      return Promise.resolve(true);
    });

    const mockPhoto = new Photo();
    mockPhoto.name = 'test photo name';
    mockPhoto.url = 'http://test.aws.s3.com/mockphoto.jpg';

    jest.spyOn(photoRepository, 'create').mockReturnValue(mockPhoto);
    jest.spyOn(photoRepository, 'save').mockResolvedValue(mockPhoto);

    jest.spyOn(JwtService.prototype, 'sign').mockReturnValue(fakeToken);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Register', () => {
    it('should create a new client when valid credentials are provided', async () => {
      const client = await authService.register(
        mockClient as RegisterClientDto,
        mockFiles as Array<Express.Multer.File>,
      );
      expect(client).toBeDefined();
    });
  });

  it('should create a new client with the provided password hashed', async () => {
    const client = await authService.register(
      mockClient as RegisterClientDto,
      mockFiles as Array<Express.Multer.File>,
    );
    expect(client.password).not.toEqual(mockClient.password);
  });

  it('should throw an error when email already exist', async () => {
    await authService.register(
      mockClient as RegisterClientDto,
      mockFiles as Array<Express.Multer.File>,
    ),
      expect(
        async () =>
          await authService.register(
            mockClient as RegisterClientDto,
            mockFiles as Array<Express.Multer.File>,
          ),
      ).rejects.toThrow(BadRequestException);
  });

  describe('Login', () => {
    it('should login the client and return a token', async () => {
      await authService.register(
        mockClient as RegisterClientDto,
        mockFiles as Array<Express.Multer.File>,
      );
      jest.spyOn(jwtService, 'sign').mockReturnValue(fakeToken);
      const token = await authService.login(
        mockClient.email,
        mockClient.password,
      );
      expect(token.token).toBeDefined();
      expect(token.token).toEqual(fakeToken);
    });

    it('should throw an error when a wrong email is provided', async () => {
      await authService.register(
        mockClient as RegisterClientDto,
        mockFiles as Array<Express.Multer.File>,
      );
      jest.spyOn(jwtService, 'sign').mockReturnValue(fakeToken);

      expect(
        async () =>
          await authService.login('testWrong@email.com', mockClient.password),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error when a wrong password is provided', async () => {
      await authService.register(
        mockClient as RegisterClientDto,
        mockFiles as Array<Express.Multer.File>,
      );
      jest.spyOn(jwtService, 'sign').mockReturnValue(fakeToken);

      (bcrypt.compare as jest.Mock).mockImplementation(() => {
        return Promise.resolve(false);
      });

      expect(
        async () => await authService.login(mockClient.email, 'wrongPass123'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
