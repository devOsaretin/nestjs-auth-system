import {
	CallHandler,
	ExecutionContext,
	HttpException,
	HttpStatus,
	NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";

export class FileUploadInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler<any>
	): Observable<any> | Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest();

		const validFileExtensions = [".jpg", ".jpeg", ".png", ".gif"];
		const isAllFilesImages = request.files.every(file => {
			const fileExtension = file.originalname.split(".").pop().toLowerCase();
			return validFileExtensions.includes(`.${fileExtension}`);
		});

		if (!isAllFilesImages) {
			throw new HttpException(
				"All uploaded files must be images",
				HttpStatus.BAD_REQUEST
			);
		}

		if (!request.files || request.files.length < 4) {
			throw new HttpException(
				"At least 4 images are required",
				HttpStatus.BAD_REQUEST
			);
		}

		return next.handle();
	}
}
