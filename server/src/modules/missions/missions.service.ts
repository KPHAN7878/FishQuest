import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { dataSource, paginateLimit } from "../../constants";
import { FieldError } from "../../types";
import { CatchEntity } from "../catch/catch.entity";
import { Prediction } from "../prediction/prediction.entity";
import { UserEntity } from "../user/user.entity";
import { AdventurerEntity } from "./adventurer.entity";
import { AnglerEntity } from "./angler.entity";
import { BiologistEntity } from "./biologist.entity";
@Injectable()
export class MissionsService {
    constructor(
        @InjectRepository(AnglerEntity)
        private readonly anglerRepository: Repository<AnglerEntity>,

        @InjectRepository(BiologistEntity)
        private readonly biologistRepository: Repository<BiologistEntity>,

        @InjectRepository(AdventurerEntity)
        private readonly adventurerRepository: Repository<AdventurerEntity>
        
      ) {}
      async insert(
        postData: any,
        user: UserEntity,
        repo: any,
        entity: any
      ): Promise<any> {
        

        const missionsEntry = entity.findOneby({where: {userId: postData.userId}})
        if(missionsEntry){
          repo.update({userId: postData.userId}, {value: missionsEntry.value+1})
        }
        
        };

      async adventurer_check(
        postData: CatchEntity & Prediction
      ): Promise<boolean>{
        //check location data, if incriment then call insert
        //insert(postData, postData.user, this.adventurerRepository, AdventurerEntity)
        //return bool (pass check or no)
        return true
      }

      async biologist_check(
        postData: CatchEntity & Prediction
      ): Promise<boolean>{
        //check species off all catches
        //insert(postData, postData.user, this.biologistRepository, BiologistEntity)
        //return bool (pass check or no)
        return true
      }

      async angler_check(
        postData: CatchEntity & Prediction
      ): Promise<boolean>{
        this.insert(postData, postData.user, this.anglerRepository, AnglerEntity)
        return true
      }

      
    
}

