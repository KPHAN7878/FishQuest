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

@Entity()
class BaseMission extends BaseEntity {
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
export class AdventurerEntity extends BaseMission {}
export class AnglerEntity extends BaseMission {}
export class BiologistEntity extends BaseMission {}

@Entity()
export class MissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  startSnapshot: string; // json snapshot of values when mission assigned

  @Column()
  missionSpecifier: string; // json snapshot of the completion conditions

  @Column({ default: false })
  complete: boolean;

  @Column()
  deadline: boolean;

  @ManyToOne(() => UserEntity, (user) => user.missions, { cascade: true })
  user: UserEntity;
}
