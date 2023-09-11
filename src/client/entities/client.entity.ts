import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { IsUrl } from 'class-validator';
import { Photo } from './photo.entity';

@Entity('clients')
export class Client extends User {
  @Column()
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  avatar: string;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  @BeforeInsert()
  insertDefaultAvatar() {
    this.avatar = `https://eu.ui-avatars.com/api/?name=${this.firstName}+${this.lastName}&size=250`;
  }
}
