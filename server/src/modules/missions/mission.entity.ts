import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../user/user.entity";
import { Difficulty } from "./missionTypes";

@Entity()
class BaseValue extends BaseEntity {
  @PrimaryColumn()
  userId!: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: "1" })
  value!: number;

  @OneToOne(() => UserEntity, { cascade: true })
  @JoinColumn()
  user: UserEntity;
}
export class AdventurerEntity extends BaseValue {}
export class AnglerEntity extends BaseValue {}
export class BiologistEntity extends BaseValue {}

@Entity()
export class MissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  startSnapshot: string; // json snapshot of values when mission assigned

  @Column()
  specifier: string; // json snapshot of the completion conditions

  @Column()
  difficulty: Difficulty;

  @Column()
  description: string;

  @Column({ default: false })
  complete: boolean;

  @Column({ nullable: true })
  deadline: Date;

  @ManyToOne(() => UserEntity, (user) => user.missions, { cascade: true })
  user: UserEntity;
}
