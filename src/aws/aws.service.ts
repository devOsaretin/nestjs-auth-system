import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private readonly s3 = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
    },
  });
  constructor(private configService: ConfigService) {}

  async upload(fileName: string, file: Buffer) {
    const bucketName = this.configService.get('AWS_BUCKET_NAME');
    const region = this.configService.getOrThrow('AWS_REGION');
    const key = `${Date.now()}${fileName}`;
    const objectInput: PutObjectCommandInput = {
      Bucket: bucketName,
      Body: file,
      Key: key,
      ACL: 'public-read',
    };

    try {
      const response: PutObjectCommandOutput = await this.s3.send(
        new PutObjectCommand(objectInput),
      );
      if (response.$metadata.httpStatusCode === 200) {
        return {
          url: `https://${bucketName}.s3.${region}.amazonaws.com/${key}`,
          name: fileName,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
}
