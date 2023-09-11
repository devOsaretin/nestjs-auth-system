import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Client } from "./entities/client.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterClientDto } from "./dto/register-client.dto";

@Injectable()
export class ClientService {
	constructor(
		@InjectRepository(Client)
		private clientRepository: Repository<Client>
	) {}

	async create(registerClientDto: RegisterClientDto) {
		const { firstName, lastName, email, password, role } = registerClientDto;

		const client = this.clientRepository.create({
			firstName,
			lastName,
			email,
			password,
			role,
		});

		return await this.clientRepository.save(client);
	}

	async findOne(id: number) {
		if (!id) return null;
		return await this.clientRepository.findOneBy({ id });
	}

	async findByEmail(email: string) {
		return this.clientRepository.findOne({ where: { email } });
	}

	async find() {
		return this.clientRepository.find({ relations: ["photos"] });
	}
}
