export const likeSubquery = (type?: "post" | "comment", id?: number) => {
  if (type)
    return id
      ? `(select exists ` +
          '(select "likableId" from public.like_entity l where ' +
          `l."userId" = ${id} and l."type" = '${type}' and ` +
          `l."likableId" = ${type === "post" ? "p.id" : "c.id"})) "liked"`
      : 'null as "liked"';
  else
    return id
      ? `(select exists ` +
          '(select "likableId" from public.like_entity l where ' +
          `l."userId" = ${id})) "liked"`
      : 'null as "liked"';
};

export const followingSubquery = (id?: number) => {
  return id
    ? `(select exists (select * from ` +
        `user_entity ` +
        `where f."userEntityId_1" in (select "userEntityId_1" ` +
        `from rfollowing where "userEntityId_2" = ${id}))) "following"`
    : 'null as "following"';
};
