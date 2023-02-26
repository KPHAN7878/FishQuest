import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Prediction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int", default: 0 })
  score: number;

  @Column({ nullable: true })
  status: boolean; // missing | correct | incorrect pred

  @Column({ nullable: true })
  species: string;

  @Column("int", { array: true })
  modelOutput?: string; // output tensor representation
}
