import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  source: string;

  @Column({ nullable: true })
  target: string;

  @Column('jsonb')
  payload: any;

  @Column({ nullable: true })
  correlationId: string;

  @Column({ default: 'medium' })
  priority: string;

  @CreateDateColumn()
  timestamp: Date;
}
