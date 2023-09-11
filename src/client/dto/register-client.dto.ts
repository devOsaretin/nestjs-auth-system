import {
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	Length,
	Matches,
} from "class-validator";

export class RegisterClientDto {
	@IsString()
	@IsNotEmpty()
	@Length(2, 25)
	firstName: string;

	@IsString()
	@IsNotEmpty()
	@Length(2, 25)
	lastName: string;

	@IsEmail()
	email: string;

	@IsString()
	@Length(6, 50)
	@Matches(/.*\d.*/, { message: "Password must have atleast a number" })
	password: string;

	@IsString()
	@IsNotEmpty()
	role: string;
}
