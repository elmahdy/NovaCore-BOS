import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1700000000000 implements MigrationInterface {
  name = 'InitSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Comptes utilisateurs (identité / authentification)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" varchar NOT NULL UNIQUE,
        "password" varchar NOT NULL,
        "roles" text[] DEFAULT '{}',
        "createdAt" timestamp DEFAULT now()
      );
    `);

    // Comptes agents (staff) liés aux users via userId
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "staff" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "matricule" varchar NOT NULL,
        "firstName" varchar NOT NULL,
        "lastName" varchar NOT NULL,
        "position" varchar,
        "department" varchar,
        "staffRole" varchar DEFAULT 'agent',
        "status" varchar DEFAULT 'active',
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        CONSTRAINT "uq_staff_user" UNIQUE ("userId")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "staff";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);
  }
}
