import {
	Body,
	Controller,
	Post,
	Get,
	UploadedFiles,
	UseInterceptors,
	UseGuards,
	ClassSerializerInterceptor,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { AuthService } from "./auth.service";
import { FileUploadInterceptor } from "../interceptors/fileupload.interceptor";
import { RegisterClientDto } from "../client/dto/register-client.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { AuthClient } from "../decorators/auth-client.decorator";
import { Client } from "../client/entities/client.entity";

@Controller()
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post("register")
	@UseInterceptors(FilesInterceptor("files"), FileUploadInterceptor)
	async register(
		@Body() registerClientDto: RegisterClientDto,
		@UploadedFiles() files: Array<Express.Multer.File>
	): Promise<Client> {
		return this.authService.register(registerClientDto, files);
	}

	@Post("login")
	async login(
		@Body("email") email: string,
		@Body("password") password: string
	): Promise<{ token: string }> {
		return this.authService.login(email, password);
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get("users/me")
	@UseGuards(JwtAuthGuard)
	async getAuthClient(@AuthClient() client: Client) {
		return client;
	}
}
