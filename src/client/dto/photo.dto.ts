import { UserDto } from './user.dto';

export class PhotoDto {
  name: string;
  url: string;
  user: UserDto;
}
