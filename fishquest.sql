CREATE TABLE IF NOT EXISTS public.acheviements
(
    "achID" bigint NOT NULL,
    "userID" bigint NOT NULL,
    CONSTRAINT acheviements_pkey PRIMARY KEY ("achID", "userID"),
    CONSTRAINT "achID" FOREIGN KEY ("achID")
        REFERENCES public."acheviementsLabel" ("achID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "userID" FOREIGN KEY ("userID")
        REFERENCES public.users ("userID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

CREATE TABLE IF NOT EXISTS public."acheviementsLabel"
(
    "achID" bigint NOT NULL,
    "achName" character varying COLLATE pg_catalog."default", --variable char is essentially a string. bs
    CONSTRAINT 
        "acheviementsLabel_pkey" PRIMARY KEY ("achID")
)

CREATE TABLE IF NOT EXISTS public.catch
(
    "catchID" bigint NOT NULL,
    "userID" bigint NOT NULL,
    location integer[], --figure out coordinates. bs
    "time" time without time zone[], --time zone shouldn't matter because what matters is what time it was locally when the fish was caught. bs
    species character varying COLLATE pg_catalog."default",
    CONSTRAINT catch_pkey PRIMARY KEY ("catchID"),
    CONSTRAINT "userID" FOREIGN KEY ("userID")
        REFERENCES public.users ("userID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

CREATE TABLE IF NOT EXISTS public.comment
(
    "postID" bigint NOT NULL,
    "userID" bigint NOT NULL,
    text character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT 
        comment_pkey PRIMARY KEY ("userID", "postID")
    CONSTRAINT "postID" FOREIGN KEY ("postID")
        REFERENCES public.post ("postID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "userID" FOREIGN KEY ("userID")
        REFERENCES public.users ("userID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

CREATE TABLE IF NOT EXISTS public.post
(
    "userID" bigint NOT NULL,
    "postID" bigint NOT NULL,
    image "char"[], --figure out how to store images. bs
    "catchID" bigint,
    text character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT 
        post_pkey PRIMARY KEY ("userID", "postID")
    CONSTRAINT "postID" UNIQUE ("postID"), --must be unique to be used for foreign key. bs
    CONSTRAINT "userID" FOREIGN KEY ("userID")
        REFERENCES public.users ("userID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

CREATE TABLE IF NOT EXISTS public.reaction
(
    "postID" bigint NOT NULL,
    "userID" bigint NOT NULL,
    type "char"[], --only char to save space, don't need a full string when the first letter will suffice. bs
    CONSTRAINT 
        reaction_pkey PRIMARY KEY ("postID", "userID")
    CONSTRAINT "postID" FOREIGN KEY ("postID")
        REFERENCES public.post ("postID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "userID" FOREIGN KEY ("userID")
        REFERENCES public.users ("userID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

CREATE TABLE IF NOT EXISTS public.users
(
    "userID" bigint NOT NULL,
    "firstName" character varying COLLATE pg_catalog."default" NOT NULL,
    "lastName" character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    username character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT 
        user_pkey PRIMARY KEY ("userID", username)
    CONSTRAINT "userID" UNIQUE ("userID") --must be unique to be used for foreign key. bs
)