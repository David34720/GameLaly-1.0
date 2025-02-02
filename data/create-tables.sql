-- Démarre une transaction
BEGIN;

-- Supprimer les tables existantes avec CASCADE pour gérer les dépendances
DROP TABLE IF EXISTS "users", "role", "level", "map", "room", "score", "item", "item_type", "message", "cell" CASCADE;

CREATE TABLE IF NOT EXISTS "level" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "role" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "email" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,
    "password" TEXT,
    "role_id" INTEGER NOT NULL DEFAULT 1 REFERENCES "role"("id") ON DELETE SET NULL,
    "admin" BOOLEAN,
    "level" INTEGER NOT NULL DEFAULT 1,
    "img" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "permission" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT
);

CREATE TABLE IF NOT EXISTS "permission_has_role" (
    "permission_id" INTEGER REFERENCES "permission"("id") ON DELETE CASCADE,
    "role_id" INTEGER REFERENCES "role"("id") ON DELETE CASCADE,
    PRIMARY KEY(permission_id, role_id)
);

INSERT INTO "role" ("name") VALUES ('user'), ('admin');

INSERT INTO
    "permission" (name)
VALUES
    ('assign_role'),
    ('play'),    
    ('all');

INSERT INTO "permission_has_role" (permission_id, role_id) VALUES (1, 2), (2, 1), (2, 2);

CREATE TABLE IF NOT EXISTS "map" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT,
    "description" TEXT,
    "users_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "level_id" INTEGER NOT NULL REFERENCES "level"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "room" ( 
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT,
    "description" TEXT,
    "map_id" INTEGER NOT NULL REFERENCES "map"("id") ON DELETE CASCADE,
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
    "users_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "map_id" INTEGER NOT NULL REFERENCES "map"("id") ON DELETE CASCADE,
    "last_room_id" INTEGER NOT NULL REFERENCES "room"("id") ON DELETE SET NULL,
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
    "item_type" INTEGER NOT NULL REFERENCES "item_type"("id") ON DELETE SET NULL,
    "effect" INTEGER,
    "life" INTEGER,
    "value" INTEGER,
    "context" TEXT,
    "is_obstacle" BOOLEAN NOT NULL DEFAULT FALSE,
    "is_object" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "message" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "text" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS "cell" (
    "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "room_id" INTEGER NOT NULL REFERENCES "room"("id") ON DELETE CASCADE,
    "room_id_link" INTEGER REFERENCES "room"("id") ON DELETE SET NULL,
    "item_id" INTEGER REFERENCES "item"("id") ON DELETE SET NULL,
    "layer_type" TEXT,
    "message_id" INTEGER REFERENCES "message"("id") ON DELETE SET NULL,
    "pos_x" INTEGER,
    "pos_y" INTEGER,
    "width" INTEGER NOT NULL DEFAULT 1, -- Nombre de cellules en largeur
    "height" INTEGER NOT NULL DEFAULT 1, -- Nombre de cellules en hauteur
    "offset_x" INTEGER NOT NULL DEFAULT 0, -- Décalage en X dans la cellule
    "offset_y" INTEGER NOT NULL DEFAULT 0, -- Décalage en Y dans la cellule
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ
);

ALTER TABLE "cell"
ALTER COLUMN "room_id_link" DROP NOT NULL;
-- Ajout des index pour optimiser les recherches
CREATE INDEX idx_cell_room_id ON cell(room_id);
CREATE INDEX idx_cell_room_id_link ON cell(room_id_link);

-- On persiste les changements en mettant fin à la transaction
COMMIT;
