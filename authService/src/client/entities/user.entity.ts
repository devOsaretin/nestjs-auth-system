import { Exclude, Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @Length(2, 25, { message: 'First name must be between 2 and 25 characters' })
  firstName: string;

  @Column()
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @Length(2, 25, { message: 'Last name must be between 2 and 25 characters' })
  lastName: string;

  @Column()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 50, { message: 'Password must be between 6 and 50 characters' })
  @Matches(/.*\d.*/, { message: 'Password must contain at least one number' })
  @Exclude()
  password: string;

  @Column()
  @IsString({ message: 'Role must be a string' })
  @IsNotEmpty({ message: 'Role is required' })
  role: string;

  @Column({ default: true })
  @IsBoolean()
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
