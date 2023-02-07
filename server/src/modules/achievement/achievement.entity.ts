import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../user/user.entity";
import { AchievementLabelEntity } from "../achievementLabel/achievementLabel.entity";

@Entity()
export class AchievementEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ManyToOne(() => AchievementLabelEntity, (achId) => achId)
  achId!: number;

  @PrimaryColumn()
  @ManyToOne(() => UserEntity, (user) => user.id)
  userId!: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;



}
