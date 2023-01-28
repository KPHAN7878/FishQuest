import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Prediction extends BaseEntity {
  @PrimaryColumn()
  creatorId!: number;

  @Column({ type: "int", default: 0 })
  score: number;

  @Column({ nullable: true })
  status: boolean; // missing | correct | incorrect pred

  @Column({ nullable: true })
  species: string;

  @Column("int", { array: true })
  modelOutput?: number[]; // output tensor representation
}
