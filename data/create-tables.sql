-- Démarre une transaction
BEGIN;

-- Supprimer les tables existantes avec CASCADE pour gérer les dépendances
DROP TABLE IF EXISTS  "users", "level", "map", "room", "score", "item", "item_type", "message", "cell" CASCADE;

CREATE TABLE IF NOT EXISTS "level" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "users" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "email" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,
    "password" TEXT,
    "admin" BOOLEAN,
    "level" INTEGER NOT NULL DEFAULT 1,
    "img" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "map" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT,
    "description" TEXT,
    "users_id" INTEGER NOT NULL REFERENCES "users"("id"),
    "level_id" INTEGER NOT NULL REFERENCES "level"("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "room" ( 
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT,
    "description" TEXT,
    "map_id" INTEGER NOT NULL REFERENCES "map"("id"),
    "first_room" BOOLEAN,
    "cell_size" INTEGER,
    "nb_rows" INTEGER,
    "nb_cols" INTEGER,
    "start_x" INTEGER,
    "start_y" INTEGER,
    "img_bg" TEXT,
    "color_bg" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "score" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "users_id" INTEGER NOT NULL REFERENCES "users"("id"),
    "map_id" INTEGER NOT NULL REFERENCES "map"("id"),
    "last_room_id" INTEGER NOT NULL REFERENCES "room"("id"),
    "score" INTEGER,
    "life" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "item_type" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "item" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT,
    "description" TEXT,
    "img" TEXT,
    "item_type" INTEGER NOT NULL REFERENCES "item_type"("id"),
    "effect" INTEGER,
    "life" INTEGER,
    "value" INTEGER,
    "context" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "message" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "room_id" INTEGER NOT NULL REFERENCES "room"("id"),
    "item_id" INTEGER REFERENCES "item"("id"),
    "text" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "cell" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "room_id" INTEGER NOT NULL REFERENCES "room"("id") ON DELETE CASCADE,
    "room_id_link" INTEGER REFERENCES "room"("id") ON DELETE SET NULL,
    "item_id" INTEGER REFERENCES "item"("id"),
    "message_id" INTEGER REFERENCES "message"("id"),
    "pos_x" INTEGER,
    "pos_y" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

-- Ajout des index pour optimiser les recherches
CREATE INDEX idx_cell_room_id ON cell(room_id);
CREATE INDEX idx_cell_room_id_link ON cell(room_id_link);

-- On persiste les changements en mettant fin à la transaction
COMMIT;

