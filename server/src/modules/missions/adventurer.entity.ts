import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn
  } from "typeorm";
  import { UserEntity } from "../user/user.entity";

  
  @Entity()
  export class AdventurerEntity extends BaseEntity {
    @PrimaryColumn()
    userId!: number;
  
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    value!: number;

    @Column() 
    rank!: number;  //achievement ranks 0-4 none, bronze, silver, gold, diamond


  }