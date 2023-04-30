import { MigrationInterface, QueryRunner } from "typeorm";

export class latest1682822278766 implements MigrationInterface {
  name = "latest1682822278766";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "session_entity" ("expiredAt" bigint NOT NULL, "id" character varying(255) NOT NULL, "json" text NOT NULL, "destroyedAt" TIMESTAMP, CONSTRAINT "PK_897bc09b92e1a7ef6b30cba4786" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7d2e5aa5b5cf129432c1222c82" ON "session_entity" ("expiredAt") `
    );
    await queryRunner.query(
      `CREATE TABLE "prediction" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "score" integer NOT NULL DEFAULT '0', "status" boolean, "species" character varying, "confidence" double precision, "box" double precision array, CONSTRAINT "PK_22aeff62bb5b3f6b4441a93fb9f" PRIMARY KEY ("id", "userId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "comment_entity" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "creatorId" integer NOT NULL, "commentableId" integer NOT NULL, "text" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "likeValue" integer NOT NULL DEFAULT '0', "commentValue" integer NOT NULL DEFAULT '0', "userId" integer, "userUsername" character varying, "postId" integer, "commentId" integer, "commentCreatorId" integer, "commentCommentableId" integer, CONSTRAINT "PK_eb6a922e3ca378ab92d815d5854" PRIMARY KEY ("id", "creatorId", "commentableId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "like_entity" ("type" character varying NOT NULL, "likableId" integer NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userUsername" character varying, "postId" integer, "commentId" integer, "commentCreatorId" integer, "commentCommentableId" integer, CONSTRAINT "PK_7972d008eebd5d2906176d647f2" PRIMARY KEY ("type", "likableId", "userId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "post_entity" ("id" SERIAL NOT NULL, "creatorId" integer NOT NULL, "text" character varying NOT NULL, "likeValue" integer NOT NULL DEFAULT '0', "commentValue" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "userUsername" character varying, "catchId" integer, CONSTRAINT "REL_7d3eefe768d7816eeafce15551" UNIQUE ("catchId"), CONSTRAINT "PK_58a149c4e88bf49036bc4c8c79f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "catch_entity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "location" double precision array, "imageUri" character varying NOT NULL, "note" character varying, "bait" character varying, "weight" double precision, "userId" integer, "userUsername" character varying, "predictionId" integer, "predictionUserId" integer, CONSTRAINT "REL_6db367bd15c78ee2d5e6909390" UNIQUE ("predictionId", "predictionUserId"), CONSTRAINT "PK_47a24764f1170318e8b411506ab" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "adventurer_entity" ("userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "value" integer NOT NULL DEFAULT '0', "userUsername" character varying, CONSTRAINT "REL_6fbb2c40500fa4648fa76ebe12" UNIQUE ("userId", "userUsername"), CONSTRAINT "PK_b134758b8355dfcbc1e539360a5" PRIMARY KEY ("userId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "angler_entity" ("userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "value" integer NOT NULL DEFAULT '0', "userUsername" character varying, CONSTRAINT "REL_6f4bdf24257890cb5876df864e" UNIQUE ("userId", "userUsername"), CONSTRAINT "PK_226d4ed229216c786abf6443659" PRIMARY KEY ("userId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "biologist_entity" ("userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "value" integer NOT NULL DEFAULT '0', "userUsername" character varying, CONSTRAINT "REL_669816f740be1c07a418cec069" UNIQUE ("userId", "userUsername"), CONSTRAINT "PK_7938dc8728682965d32ff268303" PRIMARY KEY ("userId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "mission_entity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "startSnapshot" character varying NOT NULL, "specifier" character varying NOT NULL, "difficulty" integer NOT NULL, "description" character varying NOT NULL, "complete" boolean NOT NULL DEFAULT false, "deadline" TIMESTAMP, "userId" integer, "userUsername" character varying, CONSTRAINT "PK_9ace09942e3a20d4c497a91c1a4" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "profilePicUrl" character varying, "exp" integer NOT NULL DEFAULT '0', "level" integer NOT NULL DEFAULT '1', CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e" UNIQUE ("username"), CONSTRAINT "PK_edf6bd1362f130029754d4d6b10" PRIMARY KEY ("id", "username"))`
    );
    await queryRunner.query(
      `CREATE TABLE "token_entity" ("userId" integer NOT NULL, "tokenType" character varying NOT NULL, "code" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "userUsername" character varying, CONSTRAINT "PK_82517fba623b257aef844794cd4" PRIMARY KEY ("userId", "tokenType"))`
    );
    await queryRunner.query(
      `CREATE TABLE "rfollowers" ("userEntityId_1" integer NOT NULL, "userEntityUsername_1" character varying NOT NULL, "userEntityId_2" integer NOT NULL, "userEntityUsername_2" character varying NOT NULL, CONSTRAINT "PK_c080686ce5f52e16386fb492825" PRIMARY KEY ("userEntityId_1", "userEntityUsername_1", "userEntityId_2", "userEntityUsername_2"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_019d6d62fd51af4f09bd045262" ON "rfollowers" ("userEntityId_1", "userEntityUsername_1") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_080b1161b4d29f52086e0ed56f" ON "rfollowers" ("userEntityId_2", "userEntityUsername_2") `
    );
    await queryRunner.query(
      `CREATE TABLE "rfollowing" ("userEntityId_1" integer NOT NULL, "userEntityUsername_1" character varying NOT NULL, "userEntityId_2" integer NOT NULL, "userEntityUsername_2" character varying NOT NULL, CONSTRAINT "PK_58fb47753cd8ead04ac8e6e36d0" PRIMARY KEY ("userEntityId_1", "userEntityUsername_1", "userEntityId_2", "userEntityUsername_2"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9e3be028e453e8f99377db9d06" ON "rfollowing" ("userEntityId_1", "userEntityUsername_1") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_165d4d58e2a7161c5db852b7f0" ON "rfollowing" ("userEntityId_2", "userEntityUsername_2") `
    );
    await queryRunner.query(
      `ALTER TABLE "comment_entity" ADD CONSTRAINT "FK_c8deb60eb99b2d666ca0f66068b" FOREIGN KEY ("userId", "userUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "comment_entity" ADD CONSTRAINT "FK_8149ef6edc077bb121ae704e3a8" FOREIGN KEY ("postId") REFERENCES "post_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "comment_entity" ADD CONSTRAINT "FK_fc3a0ac95c313f3f3653f3ce6b1" FOREIGN KEY ("commentId", "commentCreatorId", "commentCommentableId") REFERENCES "comment_entity"("id","creatorId","commentableId") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "like_entity" ADD CONSTRAINT "FK_a2cb105aa31ccfbe5024d9fdde9" FOREIGN KEY ("userId", "userUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "like_entity" ADD CONSTRAINT "FK_c2d3ddc21242e4d0d5fcb98e737" FOREIGN KEY ("postId") REFERENCES "post_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "like_entity" ADD CONSTRAINT "FK_16669d3e5ee7181cb201fe9e52d" FOREIGN KEY ("commentId", "commentCreatorId", "commentCommentableId") REFERENCES "comment_entity"("id","creatorId","commentableId") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "post_entity" ADD CONSTRAINT "FK_4ff43228295e3339a25a574d79e" FOREIGN KEY ("userId", "userUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "post_entity" ADD CONSTRAINT "FK_7d3eefe768d7816eeafce155518" FOREIGN KEY ("catchId") REFERENCES "catch_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "catch_entity" ADD CONSTRAINT "FK_f6f0fccd9954029be4ad2791403" FOREIGN KEY ("userId", "userUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "catch_entity" ADD CONSTRAINT "FK_6db367bd15c78ee2d5e6909390c" FOREIGN KEY ("predictionId", "predictionUserId") REFERENCES "prediction"("id","userId") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "adventurer_entity" ADD CONSTRAINT "FK_6fbb2c40500fa4648fa76ebe12d" FOREIGN KEY ("userId", "userUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "angler_entity" ADD CONSTRAINT "FK_6f4bdf24257890cb5876df864e8" FOREIGN KEY ("userId", "userUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "biologist_entity" ADD CONSTRAINT "FK_669816f740be1c07a418cec0697" FOREIGN KEY ("userId", "userUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "mission_entity" ADD CONSTRAINT "FK_acc23ca7a06e48334cb2cab0d2a" FOREIGN KEY ("userId", "userUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "token_entity" ADD CONSTRAINT "FK_2be3dc3f12e550addff60c3d71d" FOREIGN KEY ("userId", "userUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "rfollowers" ADD CONSTRAINT "FK_019d6d62fd51af4f09bd0452621" FOREIGN KEY ("userEntityId_1", "userEntityUsername_1") REFERENCES "user_entity"("id","username") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "rfollowers" ADD CONSTRAINT "FK_080b1161b4d29f52086e0ed56f4" FOREIGN KEY ("userEntityId_2", "userEntityUsername_2") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "rfollowing" ADD CONSTRAINT "FK_9e3be028e453e8f99377db9d06e" FOREIGN KEY ("userEntityId_1", "userEntityUsername_1") REFERENCES "user_entity"("id","username") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "rfollowing" ADD CONSTRAINT "FK_165d4d58e2a7161c5db852b7f0d" FOREIGN KEY ("userEntityId_2", "userEntityUsername_2") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfollowing" DROP CONSTRAINT "FK_165d4d58e2a7161c5db852b7f0d"`
    );
    await queryRunner.query(
      `ALTER TABLE "rfollowing" DROP CONSTRAINT "FK_9e3be028e453e8f99377db9d06e"`
    );
    await queryRunner.query(
      `ALTER TABLE "rfollowers" DROP CONSTRAINT "FK_080b1161b4d29f52086e0ed56f4"`
    );
    await queryRunner.query(
      `ALTER TABLE "rfollowers" DROP CONSTRAINT "FK_019d6d62fd51af4f09bd0452621"`
    );
    await queryRunner.query(
      `ALTER TABLE "token_entity" DROP CONSTRAINT "FK_2be3dc3f12e550addff60c3d71d"`
    );
    await queryRunner.query(
      `ALTER TABLE "mission_entity" DROP CONSTRAINT "FK_acc23ca7a06e48334cb2cab0d2a"`
    );
    await queryRunner.query(
      `ALTER TABLE "biologist_entity" DROP CONSTRAINT "FK_669816f740be1c07a418cec0697"`
    );
    await queryRunner.query(
      `ALTER TABLE "angler_entity" DROP CONSTRAINT "FK_6f4bdf24257890cb5876df864e8"`
    );
    await queryRunner.query(
      `ALTER TABLE "adventurer_entity" DROP CONSTRAINT "FK_6fbb2c40500fa4648fa76ebe12d"`
    );
    await queryRunner.query(
      `ALTER TABLE "catch_entity" DROP CONSTRAINT "FK_6db367bd15c78ee2d5e6909390c"`
    );
    await queryRunner.query(
      `ALTER TABLE "catch_entity" DROP CONSTRAINT "FK_f6f0fccd9954029be4ad2791403"`
    );
    await queryRunner.query(
      `ALTER TABLE "post_entity" DROP CONSTRAINT "FK_7d3eefe768d7816eeafce155518"`
    );
    await queryRunner.query(
      `ALTER TABLE "post_entity" DROP CONSTRAINT "FK_4ff43228295e3339a25a574d79e"`
    );
    await queryRunner.query(
      `ALTER TABLE "like_entity" DROP CONSTRAINT "FK_16669d3e5ee7181cb201fe9e52d"`
    );
    await queryRunner.query(
      `ALTER TABLE "like_entity" DROP CONSTRAINT "FK_c2d3ddc21242e4d0d5fcb98e737"`
    );
    await queryRunner.query(
      `ALTER TABLE "like_entity" DROP CONSTRAINT "FK_a2cb105aa31ccfbe5024d9fdde9"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment_entity" DROP CONSTRAINT "FK_fc3a0ac95c313f3f3653f3ce6b1"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment_entity" DROP CONSTRAINT "FK_8149ef6edc077bb121ae704e3a8"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment_entity" DROP CONSTRAINT "FK_c8deb60eb99b2d666ca0f66068b"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_165d4d58e2a7161c5db852b7f0"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9e3be028e453e8f99377db9d06"`
    );
    await queryRunner.query(`DROP TABLE "rfollowing"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_080b1161b4d29f52086e0ed56f"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_019d6d62fd51af4f09bd045262"`
    );
    await queryRunner.query(`DROP TABLE "rfollowers"`);
    await queryRunner.query(`DROP TABLE "token_entity"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
    await queryRunner.query(`DROP TABLE "mission_entity"`);
    await queryRunner.query(`DROP TABLE "biologist_entity"`);
    await queryRunner.query(`DROP TABLE "angler_entity"`);
    await queryRunner.query(`DROP TABLE "adventurer_entity"`);
    await queryRunner.query(`DROP TABLE "catch_entity"`);
    await queryRunner.query(`DROP TABLE "post_entity"`);
    await queryRunner.query(`DROP TABLE "like_entity"`);
    await queryRunner.query(`DROP TABLE "comment_entity"`);
    await queryRunner.query(`DROP TABLE "prediction"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7d2e5aa5b5cf129432c1222c82"`
    );
    await queryRunner.query(`DROP TABLE "session_entity"`);
  }
}
