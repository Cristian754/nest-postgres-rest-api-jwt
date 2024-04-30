import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, DeleteDateColumn, CreateDateColumn } from "typeorm";
import { IsEmail, MaxLength, MinLength } from "class-validator";
import { v4 as uuidv4 } from 'uuid';
import { Role } from "../../common/enums/roles.enum";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true , unique: true })
  username: string;

  @Column({ nullable: true, unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true, select: false })
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @Column({ default: Role.USER , enum: Role, type: 'enum' })
  role: Role;

  @Column({ nullable: true })
  birthdate: Date;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  sex: string;

  @Column({ nullable: true })
  country: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }

}
