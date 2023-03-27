import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { UserEntity } from "../user/user.entity";

  
  @Entity()
  export class BiologistEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    userId!: number;
  
    @CreateDateColumn()
    createdAt: Date;

    @Column({default: '0'})
    value!: number;


    @OneToOne(() => UserEntity, { cascade: true })
    @JoinColumn()
    user: UserEntity;

  }