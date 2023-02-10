import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AchievementEntity } from "../achievement/achievement.entity";

@Entity()
export class AchievementLabelEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @OneToMany(() => AchievementEntity, (achievement) => achievement.achId)
  achId!: number;

  @Column({ unique: true })
  achName!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


}
