import { BaseEntity } from "typeorm";
import { UserEntity } from "../modules/user/user.entity";

export const include = <T extends BaseEntity>(
  entity: T,
  includes: (keyof T | Record<any, any>)[]
): T => {
  let included: Record<any, any> = {};

  includes.forEach((val) => {
    for (const key in entity) {
      if (val instanceof Object && key in val) {
        included[key] = include<any>(entity[key], val[key]);
      } else if (val instanceof Array && val.includes(key)) {
        included[key] = entity[key];
      } else if (val === key) {
        included[key] = entity[key];
      }
    }
  });

  return included as T;
};

export const exclude = <T extends BaseEntity>(
  entity: T,
  excludes: (keyof T | Record<any, any>)[]
): T => {
  let excluded: Record<any, any> = {};

  excludes.forEach((val) => {
    for (const key in entity) {
      if (val instanceof Object && key in val) {
        excluded[key] = exclude<any>(entity[key], val[key]);
      } else if ((val instanceof Array && val.includes(key)) || val === key) {
        continue;
      } else {
        excluded[key] = entity[key];
      }
    }
  });

  return excluded as T;
};

export const formUser = (val: any & { user: UserEntity }) => {
  const retUser = include<UserEntity>(val.user, [
    "username",
    "id",
    "profilePicUrl",
  ]);
  val.user = retUser;

  return val;
};
