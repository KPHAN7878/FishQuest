import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn
  } from "typeorm";
  import { UserEntity } from "../user/user.entity";

  
  @Entity()
  export class AdventurerEntity extends BaseEntity {
    @PrimaryColumn()
    userId!: number;
  
    @CreateDateColumn()
    createdAt: Date;

    @Column({default: '0'})
    value!: number;

    @OneToOne(() => UserEntity, { cascade: true })
    @JoinColumn()
    user: UserEntity;

  }