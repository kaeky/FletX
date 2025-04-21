import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1745228541627 implements MigrationInterface {
    name = 'InitialMigration1745228541627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."dim_users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "dim_users" ("id" SERIAL NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "position" character varying(100) NOT NULL, "salary" integer NOT NULL, "phone" character varying(20) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."dim_users_role_enum" NOT NULL DEFAULT 'user', "company_id" integer, CONSTRAINT "UQ_aa292bb793f819734ccd2386c75" UNIQUE ("email"), CONSTRAINT "PK_51174cfcf185adf07ba37431f6a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dim_products" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "category" character varying(100) NOT NULL, "price" numeric(10,2) NOT NULL, CONSTRAINT "PK_06b85ba364bc6637e3a9cd0d315" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dim_companies" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "sector" character varying(100) NOT NULL, "phone" character varying(20) NOT NULL, "address" character varying(200) NOT NULL, "assets" numeric(15,2) NOT NULL, "liabilities" numeric(15,2) NOT NULL, "city_id" integer, "department_id" integer, CONSTRAINT "PK_30ec6d0e2c367da70fb2f2d86e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dim_cities" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "code" character varying(10), "department_id" integer, CONSTRAINT "PK_cf03e4f45bc1e520e421342c96a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dim_departments" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "code" character varying(10), CONSTRAINT "UQ_c8b00058f6a5ca3032e635f7b19" UNIQUE ("name"), CONSTRAINT "PK_a38a8b81faa20c1f212e3f29555" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dim_company_products" ("company_id" integer NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "PK_53b8be3bcb6c7ec745c80931d77" PRIMARY KEY ("company_id", "product_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_43a4aa57e8c76be25724591296" ON "dim_company_products" ("company_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3e6f4ab116f3db37e8ed455a97" ON "dim_company_products" ("product_id") `);
        await queryRunner.query(`ALTER TABLE "dim_users" ADD CONSTRAINT "FK_40ef3eaca0f9fc624eb5f8e635b" FOREIGN KEY ("company_id") REFERENCES "dim_companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dim_companies" ADD CONSTRAINT "FK_46bf28dcaf37e7ed814df9c357d" FOREIGN KEY ("city_id") REFERENCES "dim_cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dim_companies" ADD CONSTRAINT "FK_e4bef25c626673148afec828839" FOREIGN KEY ("department_id") REFERENCES "dim_departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dim_cities" ADD CONSTRAINT "FK_6769d2fb06ede56df28255e8feb" FOREIGN KEY ("department_id") REFERENCES "dim_departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dim_company_products" ADD CONSTRAINT "FK_43a4aa57e8c76be25724591296d" FOREIGN KEY ("company_id") REFERENCES "dim_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "dim_company_products" ADD CONSTRAINT "FK_3e6f4ab116f3db37e8ed455a97e" FOREIGN KEY ("product_id") REFERENCES "dim_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dim_company_products" DROP CONSTRAINT "FK_3e6f4ab116f3db37e8ed455a97e"`);
        await queryRunner.query(`ALTER TABLE "dim_company_products" DROP CONSTRAINT "FK_43a4aa57e8c76be25724591296d"`);
        await queryRunner.query(`ALTER TABLE "dim_cities" DROP CONSTRAINT "FK_6769d2fb06ede56df28255e8feb"`);
        await queryRunner.query(`ALTER TABLE "dim_companies" DROP CONSTRAINT "FK_e4bef25c626673148afec828839"`);
        await queryRunner.query(`ALTER TABLE "dim_companies" DROP CONSTRAINT "FK_46bf28dcaf37e7ed814df9c357d"`);
        await queryRunner.query(`ALTER TABLE "dim_users" DROP CONSTRAINT "FK_40ef3eaca0f9fc624eb5f8e635b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3e6f4ab116f3db37e8ed455a97"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_43a4aa57e8c76be25724591296"`);
        await queryRunner.query(`DROP TABLE "dim_company_products"`);
        await queryRunner.query(`DROP TABLE "dim_departments"`);
        await queryRunner.query(`DROP TABLE "dim_cities"`);
        await queryRunner.query(`DROP TABLE "dim_companies"`);
        await queryRunner.query(`DROP TABLE "dim_products"`);
        await queryRunner.query(`DROP TABLE "dim_users"`);
        await queryRunner.query(`DROP TYPE "public"."dim_users_role_enum"`);
    }

}
