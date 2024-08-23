-- ----------------------------------------
-- Base de données :  "oquiz"
-- ----------------------------------------
BEGIN;
-- Insérer un utilisateur "Laly" qui est administrateur dans la table "user"
INSERT INTO "users" (email, firstname, lastname, password, admin, level, img, created_at, updated_at)
VALUES 
('laly@game.fr', 'Laly', 'Lapin', 'laly', TRUE, 1, 'image_url', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('papa@game.fr', 'Papa', 'Lapin', 'papa', TRUE, 1, 'image_url', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- ----------------------------------------
-- Déchargement des données de la table "levels"
-- ----------------------------------------
INSERT INTO
    "level" ("id", "name")
VALUES
    (1, 'Débutant'),
    (2, 'Confirmé'),
    (3, 'Expert');

-- ----------------------------------------
-- Déchargement des données de la table "map"
-- ----------------------------------------

INSERT INTO "map" (name, description, users_id, level_id, created_at, updated_at)
VALUES 
('Maison de Laly', 'Introduction', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Le secret de famille', 'Sauras-tu garder le secret?', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sauver maman', 'Enigmes', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

COMMIT;
