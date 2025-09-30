import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('otp_requests')
export class OtpRequest {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'email', length: 255 })
  email: string;

  @Column({ name: 'otp', length: 255 })
  otp: string;

  @Column({ name: 'password', length: 255 })
  password: string;

  @Column({ name: 'created_at', type: 'datetime' })
  created_at: Date;

  @Column({ name: 'expires_at', type: 'datetime' })
  expires_at: Date;

  @Column({ name: 'ho_ten', length: 255, nullable: true })
  ho_ten?: string;

  @Column({ name: 'so_dien_thoai', length: 255, nullable: true })
  so_dien_thoai?: string;

  @Column({ name: 'dia_chi', length: 255, nullable: true })
  dia_chi?: string;
}
