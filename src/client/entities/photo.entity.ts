import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Client } from './client.entity';
import { User } from './user.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @Column()
  @IsNotEmpty({ message: 'Url is required' })
  @IsUrl({}, { message: 'Photo must be a valid URL' })
  url: string;

  @ManyToOne(() => Client, (client) => client.photos, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
