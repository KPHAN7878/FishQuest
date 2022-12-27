CREATE TABLE IF NOT EXISTS public.acheviements
(
    "achID" bigint NOT NULL,
    "userID" bigint NOT NULL,
    CONSTRAINT acheviements_pkey PRIMARY KEY ("achID", "userID")
)
CREATE TABLE IF NOT EXISTS public."acheviementsLabel"
(
    "achID" bigint NOT NULL,
    "achName" "char"[] NOT NULL,
    CONSTRAINT "acheviementsLabel_pkey" PRIMARY KEY ("achID")
)
CREATE TABLE IF NOT EXISTS public.catch
(
    "catchID" bigint NOT NULL,
    "userID" bigint NOT NULL,
    location integer[],
    "time" time without time zone[],
    species "char"[],
    CONSTRAINT catch_pkey PRIMARY KEY ("catchID")
)
CREATE TABLE IF NOT EXISTS public.comment
(
    "postID" bigint NOT NULL,
    "userID" bigint NOT NULL,
    text "char"[],
    CONSTRAINT comment_pkey PRIMARY KEY ("userID", "postID")
)
CREATE TABLE IF NOT EXISTS public.post
(
    "userID" bigint NOT NULL,
    "postID" bigint NOT NULL,
    image "char"[],
    "catchID" bigint,
    text "char"[],
    CONSTRAINT post_pkey PRIMARY KEY ("userID", "postID")
)
CREATE TABLE IF NOT EXISTS public.reaction
(
    "postID" bigint NOT NULL,
    "userID" bigint NOT NULL,
    type "char"[],
    CONSTRAINT reaction_pkey PRIMARY KEY ("postID", "userID")
)
CREATE TABLE IF NOT EXISTS public."user"
(
    "userID" bigint NOT NULL,
    "firstName" "char" NOT NULL,
    "lastName" "char" NOT NULL,
    email "char" NOT NULL,
    password "char" NOT NULL,
    username "char" NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY ("userID", username)
)