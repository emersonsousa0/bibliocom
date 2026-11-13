
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CriarEstruturaInicial1700000000000
  implements MigrationInterface
{
  name = 'CriarEstruturaInicial1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "autores" (
        "id" SERIAL NOT NULL,
        "nome" VARCHAR(150) NOT NULL,
        CONSTRAINT "PK_autores" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "obras" (
        "id" SERIAL NOT NULL,
        "titulo" VARCHAR(200) NOT NULL,
        "isbn" VARCHAR(20),
        "ano_publicacao" INTEGER NOT NULL,
        "autor_id" INTEGER NOT NULL,
        CONSTRAINT "PK_obras" PRIMARY KEY ("id"),
        CONSTRAINT "FK_obras_autores"
          FOREIGN KEY ("autor_id")
          REFERENCES "autores"("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "exemplares_estado_enum" AS ENUM (
        'DISPONIVEL',
        'EMPRESTADO',
        'DESGASTADO',
        'DESCARTADO'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "exemplares" (
        "id" SERIAL NOT NULL,
        "tombo" VARCHAR(20) NOT NULL,
        "estado" "exemplares_estado_enum"
          NOT NULL DEFAULT 'DISPONIVEL',
        "data_aquisicao" DATE NOT NULL,
        "obra_id" INTEGER NOT NULL,
        CONSTRAINT "PK_exemplares" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_exemplares_tombo" UNIQUE ("tombo"),
        CONSTRAINT "FK_exemplares_obras"
          FOREIGN KEY ("obra_id")
          REFERENCES "obras"("id")
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "exemplares"`);
    await queryRunner.query(`DROP TYPE "exemplares_estado_enum"`);
    await queryRunner.query(`DROP TABLE "obras"`);
    await queryRunner.query(`DROP TABLE "autores"`);
  }
}
