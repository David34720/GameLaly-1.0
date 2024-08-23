-- Démarre une transaction
BEGIN;

DROP TABLE IF EXISTS "user", "tag", "level", "answer", "quiz", "question", "quiz_has_tag";

CREATE TABLE IF NOT EXISTS "user" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "email" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

-- version MySQL
-- CREATE TABLE IF NOT EXISTS `user` (
--     `id` INTEGER AUTOINCREMENT PRIMARY KEY,
--     `email` TEXT,
--     `firstname` TEXT
-- );

CREATE TABLE IF NOT EXISTS "tag" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    -- Avec postgresql, on peut avoir un type TEXT qui est optimisé.
    "name" VARCHAR(150),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "level" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "answer" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "description" TEXT,
    "question_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "quiz" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "title" TEXT,
    "description" TEXT,
    "user_id" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "question" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "description" TEXT,
    "anecdote" TEXT,
    "wiki" TEXT,
    "answer_id" INTEGER NOT NULL REFERENCES "answer"("id"), -- la bonne réponse
    "level_id" INTEGER NOT NULL REFERENCES "level"("id"),
    "quiz_id" INTEGER NOT NULL REFERENCES "quiz"("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "quiz_has_tag" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "quiz_id" INTEGER NOT NULL REFERENCES "quiz"("id"),
    "tag_id" INTEGER NOT NULL REFERENCES "tag"("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    -- On créé une clé composite : une contrainte
    -- On ne pourra enregistrer qu'une seule fois l'association entre une quiz et un tag
    UNIQUE("quiz_id", "tag_id")
);

-- Mise à jour de la table answer pour lui dire que question_id est une clé étrangère
ALTER TABLE "answer" ADD FOREIGN KEY ("question_id") REFERENCES "question"("id");

-- On persiste les changements en mettant fin à la transaction
COMMIT;
