import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Staff = compte agent lié à un compte User.
 * User = identité / authentification (email, password, roles).
 * Staff = profil opérationnel de l'agent (matricule, poste, affectation).
 * La relation se fait via userId (référence vers users.id).
 */
@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Lien vers le compte User (auth)
  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  matricule: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  department: string;

  // Rôle interne de l'agent (distinct des roles d'auth du User)
  @Column({ default: 'agent' })
  staffRole: string;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
