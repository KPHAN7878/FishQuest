import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { UserEntity } from "../user/user.entity";

  
  @Entity()
  export class CatchEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    fishCaught!: number;

    @Column() 
    rank!: number;  //0-3 bronze, silver, gold, diamond

    @OneToOne(() => UserEntity, (user) => user.ang)
    user: UserEntity;

  }
  