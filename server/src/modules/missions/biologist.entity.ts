import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { UserEntity } from "../user/user.entity";

  
  @Entity()
  export class BiologistEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    userId!: number;
  
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    value!: number;

    @Column() 
    rank!: number;  //achievement ranks 0-4 none, bronze, silver, gold, diamond


  }