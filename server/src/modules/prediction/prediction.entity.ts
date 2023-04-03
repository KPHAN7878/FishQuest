import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Prediction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @PrimaryColumn()
  userId!: number;

  @Column({ type: "int", default: 0 })
  score: number;

  @Column({ nullable: true })
  status: boolean; // missing | correct | incorrect pred

  @Column({ nullable: true })
  species: string;

  @Column()
  modelOutput?: string; // output tensor representation
}
