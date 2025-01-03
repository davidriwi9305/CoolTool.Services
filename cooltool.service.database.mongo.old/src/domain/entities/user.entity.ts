import { IsEmail,  IsNotEmpty, Length } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users') // Maps to 'users' table in SQLite
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') // Auto-generates UUID as primary key
  id: string;

  @IsNotEmpty()
  @Length(3, 50)
  @Column({ length: 100 })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;
}
