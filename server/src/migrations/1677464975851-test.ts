import { MigrationInterface, QueryRunner } from "typeorm";

export class test1677464975851 implements MigrationInterface {
    name = 'test1677464975851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_entity" DROP CONSTRAINT "FK_430c245dcc55ddb8dc9cb54f0f5"`);
        await queryRunner.query(`CREATE TABLE "like_entity" ("value" integer NOT NULL, "userId" integer NOT NULL, "userUsername" character varying, "postId" integer, "commentUserId" integer, CONSTRAINT "PK_a21b292185d6c43197f299e16b6" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP CONSTRAINT "PK_a065101de66a83c3b0d70cbd124"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD CONSTRAINT "PK_690ebcf886f38254cd19c45c4d2" PRIMARY KEY ("postId", "userId")`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP COLUMN "commId"`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP CONSTRAINT "PK_e55623412a2747775386b01a2aa"`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD CONSTRAINT "PK_5e32998d7ac08f573cde04fbfa5" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP COLUMN "postId"`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP COLUMN "userIdId"`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP COLUMN "userIdUsername"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD "userUsername" character varying`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD "commentUserId" integer`);
        await queryRunner.query(`ALTER TABLE "reaction_entity" ADD "userUsername" character varying`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP CONSTRAINT "PK_5e32998d7ac08f573cde04fbfa5"`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD CONSTRAINT "PK_23b5ce2297d56ce5e8d91aa1691" PRIMARY KEY ("userId", "id")`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD "userUsername" character varying`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ALTER COLUMN "postId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP CONSTRAINT "PK_690ebcf886f38254cd19c45c4d2"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD CONSTRAINT "PK_e391949c5735c084dddcb6e6468" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "post_entity" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP CONSTRAINT "PK_23b5ce2297d56ce5e8d91aa1691"`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD CONSTRAINT "PK_58a149c4e88bf49036bc4c8c79f" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD CONSTRAINT "FK_c8deb60eb99b2d666ca0f66068b" FOREIGN KEY ("userId", "userUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD CONSTRAINT "FK_8149ef6edc077bb121ae704e3a8" FOREIGN KEY ("postId") REFERENCES "post_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD CONSTRAINT "FK_c841153279422062d5cac1a9d2d" FOREIGN KEY ("commentUserId") REFERENCES "comment_entity"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like_entity" ADD CONSTRAINT "FK_a2cb105aa31ccfbe5024d9fdde9" FOREIGN KEY ("userId", "userUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like_entity" ADD CONSTRAINT "FK_c2d3ddc21242e4d0d5fcb98e737" FOREIGN KEY ("postId") REFERENCES "post_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like_entity" ADD CONSTRAINT "FK_4ea26a3a1409ec83ed3d7ff1171" FOREIGN KEY ("commentUserId") REFERENCES "comment_entity"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reaction_entity" ADD CONSTRAINT "FK_5df9007d261c6d9c46fc7b817f2" FOREIGN KEY ("userId", "userUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reaction_entity" ADD CONSTRAINT "FK_9bb35f70f78a3a7b368d4719474" FOREIGN KEY ("postId") REFERENCES "post_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD CONSTRAINT "FK_4ff43228295e3339a25a574d79e" FOREIGN KEY ("userId", "userUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_entity" DROP CONSTRAINT "FK_4ff43228295e3339a25a574d79e"`);
        await queryRunner.query(`ALTER TABLE "reaction_entity" DROP CONSTRAINT "FK_9bb35f70f78a3a7b368d4719474"`);
        await queryRunner.query(`ALTER TABLE "reaction_entity" DROP CONSTRAINT "FK_5df9007d261c6d9c46fc7b817f2"`);
        await queryRunner.query(`ALTER TABLE "like_entity" DROP CONSTRAINT "FK_4ea26a3a1409ec83ed3d7ff1171"`);
        await queryRunner.query(`ALTER TABLE "like_entity" DROP CONSTRAINT "FK_c2d3ddc21242e4d0d5fcb98e737"`);
        await queryRunner.query(`ALTER TABLE "like_entity" DROP CONSTRAINT "FK_a2cb105aa31ccfbe5024d9fdde9"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP CONSTRAINT "FK_c841153279422062d5cac1a9d2d"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP CONSTRAINT "FK_8149ef6edc077bb121ae704e3a8"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP CONSTRAINT "FK_c8deb60eb99b2d666ca0f66068b"`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP CONSTRAINT "PK_58a149c4e88bf49036bc4c8c79f"`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD CONSTRAINT "PK_23b5ce2297d56ce5e8d91aa1691" PRIMARY KEY ("userId", "id")`);
        await queryRunner.query(`ALTER TABLE "post_entity" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP CONSTRAINT "PK_e391949c5735c084dddcb6e6468"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD CONSTRAINT "PK_690ebcf886f38254cd19c45c4d2" PRIMARY KEY ("postId", "userId")`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ALTER COLUMN "postId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP COLUMN "userUsername"`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP CONSTRAINT "PK_23b5ce2297d56ce5e8d91aa1691"`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD CONSTRAINT "PK_5e32998d7ac08f573cde04fbfa5" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "reaction_entity" DROP COLUMN "userUsername"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP COLUMN "commentUserId"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP COLUMN "userUsername"`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD "userIdUsername" character varying`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD "userIdId" integer`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD "postId" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post_entity" DROP CONSTRAINT "PK_5e32998d7ac08f573cde04fbfa5"`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD CONSTRAINT "PK_e55623412a2747775386b01a2aa" PRIMARY KEY ("postId", "userId")`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD "commId" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment_entity" DROP CONSTRAINT "PK_690ebcf886f38254cd19c45c4d2"`);
        await queryRunner.query(`ALTER TABLE "comment_entity" ADD CONSTRAINT "PK_a065101de66a83c3b0d70cbd124" PRIMARY KEY ("commId", "postId", "userId")`);
        await queryRunner.query(`DROP TABLE "like_entity"`);
        await queryRunner.query(`ALTER TABLE "post_entity" ADD CONSTRAINT "FK_430c245dcc55ddb8dc9cb54f0f5" FOREIGN KEY ("userIdId", "userIdUsername") REFERENCES "user_entity"("id","username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
