import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("otp")
export class OtpEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  code: string;
  @Column()
  login: string;
  @Column()
  expiredAt: Date;
}
