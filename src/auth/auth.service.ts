import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";

import { ConfigService } from "@nestjs/config";
import { Photo } from "../client/entities/photo.entity";
import { AwsService } from "../aws/aws.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterClientDto } from "../client/dto/register-client.dto";
import { Client } from "../client/entities/client.entity";
import { ClientService } from "../client/client.service";

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(Photo)
		private photoRepository: Repository<Photo>,
		private awsService: AwsService,
		private clientService: ClientService,
		private configService: ConfigService,
		private jwtService: JwtService
	) {}

	async verifyClient(userId: number) {
		const client = await this.clientService.findOne(userId);

		if (!client) throw new UnauthorizedException("Invalid credentials");

		return client;
	}

	async register(
		registerClientDto: RegisterClientDto,
		files: Array<Express.Multer.File>
	) {
		const { firstName, lastName, email, password, role } = registerClientDto;

		let newClient: Client;

		const client = await this.clientService.findByEmail(email);

		if (client) throw new BadRequestException("Email is already taken");

		const saltRound = parseInt(this.configService.getOrThrow("SALT_ROUNDS"));
		const hashedPassword = await bcrypt.hash(password, saltRound);

		const uploadedS3FilesData: { url: string; name: string }[] = [];

		const uploadFilesToS3 = files.map(async ({ originalname, buffer }) => {
			try {
				const s3FileUrl = await this.awsService.upload(originalname, buffer);

				if (s3FileUrl) {
					uploadedS3FilesData.push(s3FileUrl);
				}
			} catch (error) {
				console.log(error);
			}
		});

		await Promise.all(uploadFilesToS3);

		try {
			newClient = await this.clientService.create({
				firstName,
				lastName,
				email,
				password: hashedPassword,
				role,
			});

			for (const { url, name } of uploadedS3FilesData) {
				const photo = this.photoRepository.create({
					name,
					url,
					user: newClient,
				});

				await this.photoRepository.save(photo);
			}
		} catch (error) {
			console.log(error);
		}

		return newClient;
	}

	async login(email: string, password: string): Promise<{ token: string }> {
		const client = await this.clientService.findByEmail(email);

		if (!client) throw new UnauthorizedException("Invalid credentials");

		const isPasswordMatch = await bcrypt.compare(password, client.password);

		if (!isPasswordMatch)
			throw new UnauthorizedException("Invalid credentials");

		const token = this.jwtService.sign({ userId: client.id });

		return { token };
	}
}
