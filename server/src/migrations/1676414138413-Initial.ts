import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1676414138413 implements MigrationInterface {
    name = 'Initial1676414138413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "token_entity" ("userId" integer NOT NULL, "tokenType" character varying NOT NULL, "code" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "userUsername" character varying, CONSTRAINT "PK_82517fba623b257aef844794cd4" PRIMARY KEY ("userId", "tokenType"))`);
        await queryRunner.query(`CREATE TABLE "prediction" ("id" SERIAL NOT NULL, "creatorId" integer NOT NULL, "score" integer NOT NULL DEFAULT '0', "status" boolean, "species" character varying, "modelOutput" integer array NOT NULL, CONSTRAINT "PK_23df2ceecea9f8bbb996ff056a3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_entity" ("postId" SERIAL NOT NULL, "userId" integer NOT NULL, "text" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userIdId" integer, "userIdUsername" character varying, CONSTRAINT "PK_e55623412a2747775386b01a2aa" PRIMARY KEY ("postId", "userId"))`);
        await queryRunner.query(`CREATE TABLE "catch_entity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" integer NOT NULL, "comment" character varying NOT NULL, "location" integer array NOT NULL, "dataUri" character varying NOT NULL, "creatorUsername" character varying, "predDataId" integer, CONSTRAINT "REL_557eb447a4da87bec71f5be3f8" UNIQUE ("predDataId"), CONSTRAINT "PK_47a24764f1170318e8b411506ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e" UNIQUE ("username"), CONSTRAINT "PK_edf6bd1362f130029754d4d6b10" PRIMARY KEY ("id", "username"))`);
        await queryRunner.query(`CREATE TABLE "achievement_label_entity" ("achId" SERIAL NOT NULL, "achName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_721274bc61cae1d826d53cc3d57" UNIQUE ("achName"), CONSTRAINT "PK_a6bf8423fa4a0523d3c386eab4b" PRIMARY KEY ("achId"))`);
        await queryRunner.query(`CREATE TABLE "achievement_entity" ("achId" SERIAL NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "achIdAchId" integer, "userIdId" integer, "userIdUsername" character varying, CONSTRAINT "PK_206a35687ad8ce9a05e3a0d5722" PRIMARY KEY ("achId", "userId"))`);
        await queryRunner.query(`CREATE TABLE "session_entity" ("expiredAt" bigint NOT NULL, "id" character varying(255) NOT NULL, "json" text NOT NULL, "destroyedAt" TIMESTAMP, CONSTRAINT "PK_897bc09b92e1a7ef6b30cba4786" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7d2e5aa5b5cf129432c1222c82" ON "session_entity" ("expiredAt") `);
        await queryRunner.query(`CREATE TABLE "comment_entity" ("commId" SERIAL NOT NULL, "postId" integer NOT NULL, "userId" integer NOT NULL, "text" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a065101de66a83c3b0d70cbd124" PRIMARY KEY ("commId", "postId", "userId"))`);
        await queryRunner.query(`CREATE TABLE "reaction_entity" ("postId" integer NOT NULL, "userId" integer NOT NULL, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_08ba85dae358b866280b4de317f" PRIMARY KEY ("postId", "userId"))`);
        await queryRunner.query(`ALTER TABLE "token_entity" ADD CONSTRAINT "FK_2be3dc3f12e550addff60c3d71d" FOREIGN KEY ("userId", "userUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD CONSTRAINT "FK_430c245dcc55ddb8dc9cb54f0f5" FOREIGN KEY ("userIdId", "userIdUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catch_entity" ADD CONSTRAINT "FK_a59286a4e773407fb6f7838cb54" FOREIGN KEY ("creatorId", "creatorUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catch_entity" ADD CONSTRAINT "FK_557eb447a4da87bec71f5be3f85" FOREIGN KEY ("predDataId") REFERENCES "prediction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_entity" ADD CONSTRAINT "FK_1cb154fa7357842ffa000602175" FOREIGN KEY ("achIdAchId") REFERENCES "achievement_label_entity"("achId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_entity" ADD CONSTRAINT "FK_8ded04127e372982d1888a532a3" FOREIGN KEY ("userIdId", "userIdUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "achievement_entity" DROP CONSTRAINT "FK_8ded04127e372982d1888a532a3"`);
        await queryRunner.query(`ALTER TABLE "achievement_entity" DROP CONSTRAINT "FK_1cb154fa7357842ffa000602175"`);
        await queryRunner.query(`ALTER TABLE "catch_entity" DROP CONSTRAINT "FK_557eb447a4da87bec71f5be3f85"`);
        await queryRunner.query(`ALTER TABLE "catch_entity" DROP CONSTRAINT "FK_a59286a4e773407fb6f7838cb54"`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP CONSTRAINT "FK_430c245dcc55ddb8dc9cb54f0f5"`);
        await queryRunner.query(`ALTER TABLE "token_entity" DROP CONSTRAINT "FK_2be3dc3f12e550addff60c3d71d"`);
        await queryRunner.query(`DROP TABLE "reaction_entity"`);
        await queryRunner.query(`DROP TABLE "comment_entity"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7d2e5aa5b5cf129432c1222c82"`);
        await queryRunner.query(`DROP TABLE "session_entity"`);
        await queryRunner.query(`DROP TABLE "achievement_entity"`);
        await queryRunner.query(`DROP TABLE "achievement_label_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "catch_entity"`);
        await queryRunner.query(`DROP TABLE "post_entity"`);
        await queryRunner.query(`DROP TABLE "prediction"`);
        await queryRunner.query(`DROP TABLE "token_entity"`);
    }

}
