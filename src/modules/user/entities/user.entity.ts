import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({ nullable: true })
  firstName: string;
  @Column({ nullable: true })
  lastName: string;
  @Column({ unique: true })
  mobile: string;
  @Column({ nullable: true })
  password: string;
  @Column({ default: false })
  mobileVerified: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
