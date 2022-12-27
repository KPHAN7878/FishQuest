CREATE TABLE IF NOT EXISTS public.acheviements
(
    "achID" bigint NOT NULL,
    "userID" bigint NOT NULL,
    CONSTRAINT acheviements_pkey PRIMARY KEY ("achID", "userID")
)

CREATE TABLE IF NOT EXISTS public."acheviementsLabel"
(
    "achID" bigint NOT NULL,
    "achName" character varying COLLATE pg_catalog."default",
    CONSTRAINT "acheviementsLabel_pkey" PRIMARY KEY ("achID")
)

CREATE TABLE IF NOT EXISTS public.catch
(
    "catchID" bigint NOT NULL,
    "userID" bigint NOT NULL,
    location integer[],
    "time" time without time zone[],
    species character varying COLLATE pg_catalog."default",
    CONSTRAINT catch_pkey PRIMARY KEY ("catchID")
)

CREATE TABLE IF NOT EXISTS public.comment
(
    "postID" bigint NOT NULL,
    "userID" bigint NOT NULL,
    text character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT comment_pkey PRIMARY KEY ("userID", "postID")
)

CREATE TABLE IF NOT EXISTS public.post
(
    "userID" bigint NOT NULL,
    "postID" bigint NOT NULL,
    image "char"[],
    "catchID" bigint,
    text character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT post_pkey PRIMARY KEY ("userID", "postID")
)

CREATE TABLE IF NOT EXISTS public.reaction
(
    "postID" bigint NOT NULL,
    "userID" bigint NOT NULL,
    type "char"[],
    CONSTRAINT reaction_pkey PRIMARY KEY ("postID", "userID")
)

CREATE TABLE IF NOT EXISTS public.users
(
    "userID" bigint NOT NULL,
    "firstName" character varying COLLATE pg_catalog."default" NOT NULL,
    "lastName" character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    username character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY ("userID", username)
)