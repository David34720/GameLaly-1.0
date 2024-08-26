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

INSERT INTO room (name, description, map_id, first_room, cell_size, nb_rows, nb_cols, start_x, start_y, img_bg, color_bg)
VALUES ('Room Lambda', 'Description de la Room Lambda', 1, false, 50, 10, 10, 0, 0, 'background.png', '#FFFFFF');
INSERT INTO cell (room_id, room_id_link, pos_x, pos_y, item_id, message_id)
VALUES
(2, 4, 1, 1, NULL, NULL),  -- Cell dans la Room 1, pointant vers la Room 2
(2, 4, 2, 2, NULL, NULL),  -- Cell dans la Room 1, pointant vers la Room 3
(4, 2, 3, 3, NULL, NULL),  -- Cell dans la Room 2, pointant vers la Room 1
(4, 2, 4, 4, NULL, NULL);  -- Cell dans la Room 2, pointant vers la Room 3



COMMIT;
