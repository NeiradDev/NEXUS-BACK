import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'public', name: 'USER' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id_user', type: 'integer' })
  id_user: number;

  @Column({ type: 'varchar', length: 64 })
  nombres: string;

  @Column({ type: 'varchar', length: 64 })
  apellidos: string;

  @Column({ type: 'varchar', length: 10, unique: false })
  cedula: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'integer', nullable: true })
  id_agencias: number | null;

  @Column({ type: 'integer', nullable: true })
  id_cargo: number | null;

  @Column({ type: 'integer', nullable: true })
  id_supervisor: number | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column({ type: 'varchar', length: 120, nullable: true })
  correo: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string | null;
}