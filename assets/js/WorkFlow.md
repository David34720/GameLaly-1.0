# Flux de Travail 

**Génération de la Carte:** Utilisez RoomGenerator pour créer une nouvelle pièce basée sur des données initiales.

**Construction de la Carte:** Passez ces données à RoomBuilder pour créer les cellules et les afficher.

**Logique de Jeu:** Utilisez GameEngine pour gérer les mouvements du joueur et les interactions avec les items.

**Gestion des Items:** Utilisez ItemManager pour placer les items dans la pièce et gérer leur interaction avec le joueur.


# RoomBuilder :

La classe RoomBuilder génère et rend une pièce en fonction des données (roomData) fournies.
La méthode createCells utilise roomData pour générer les cellules, en vérifiant si des cellules existent déjà avec un item ou un message. Cela correspond bien à la structure de la table cell.
Les cellules sont rendues visuellement via renderMap, et l'interaction avec les cellules (comme le clic) est bien gérée.


# RoomGenerator :

RoomGenerator est bien conçu pour générer des pièces (RoomBuilder) en utilisant les données fournies.
Les méthodes de RoomGenerator permettent de définir les dimensions de la pièce, la position de départ, et l'apparence, ce qui correspond bien aux colonnes nb_rows, nb_cols, cell_size, start_x, start_y, img_bg, et color_bg de la table room.


# ItemManager :

ItemManager gère les objets du jeu, en les associant aux cellules via associateItemToCell.
Les méthodes pour afficher les objets (renderItemInCell) et gérer les clics sur les objets sont bien définies.
Le modèle s'intègre bien avec la structure de la base de données, en utilisant les relations définies dans les tables item et cell.


# GameEngine :

GameEngine est la pièce maîtresse qui intègre les autres classes pour démarrer et gérer le jeu.
Il initialise les pièces et les objets, gère les déplacements du joueur, et rend l'état du jeu en utilisant les autres classes.
Les méthodes de gestion du joueur, des objets, et des événements sont bien définies et alignées avec la structure de la base de données.


---------

# Création et Rendu d'une Cellule dans une Pièce

Ce guide détaille les étapes de création, de gestion et de rendu d'une cellule dans une pièce (room) au sein de votre application. Il couvre la transmission des données entre le serveur et le client, ainsi que la manière dont ces données sont utilisées pour générer la carte et les cellules.

1. Requête du Client pour Charger une Pièce

L'utilisateur demande à charger une pièce spécifique en accédant à une URL telle que `/rooms/edit/2`. Cette action envoie une requête au serveur pour obtenir les informations de la pièce avec l'ID 2.

2. Traitement de la Requête par le Serveur

### a. Récupération des Données

Le serveur, via le contrôleur `roomController`, interroge la base de données pour récupérer les informations sur la pièce et ses cellules associées.

### b. Envoi des Données à la Vue
Les données de la pièce (room), des cellules (cells), et des items associés (itemsData) sont ensuite passées à la vue EJS pour être rendues sur la page.

3. Rendu de la Page Côté Client
### a. Intégration des Données dans la Vue EJS
La vue EJS intègre les données JSON dans le script côté client pour initialiser les classes et générer la pièce et ses cellules.

### b. Initialisation du Moteur de Jeu
Le GameEngine utilise les données fournies pour créer et rendre la carte et les cellules associées. Il gère également les interactions utilisateur.

4. Création des Cellules
### a. Utilisation de RoomGenerator
Le RoomGenerator est utilisé pour générer les cellules de la pièce en fonction des données reçues.

### b. Affichage des Cellules
Les cellules sont affichées sur la carte en utilisant le RoomBuilder. Les cellules sont positionnées selon leurs coordonnées pos_x et pos_y et sont rendues avec leurs caractéristiques (couleur, item, message).

5. Interaction Utilisateur
### a. Gestion des Clics sur les Cellules
Lorsque l'utilisateur clique sur une cellule, le GameEngine gère les interactions telles que la collecte d'items ou l'affichage de messages.

### b. Déplacement du Joueur
Le GameEngine gère également le déplacement du joueur dans la pièce, en mettant à jour la carte en conséquence.