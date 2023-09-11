import { IsNotEmpty, IsString } from 'class-validator';

export class PhotoUploadDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  buffer: Buffer;

  constructor(file: Express.Multer.File) {
    this.name = file.originalname;
    this.buffer = file.buffer;
  }
}
