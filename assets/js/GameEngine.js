console.log("GameEngine.js");


// Modèle dédié à la logique de jeu en temps réel, le déplacement du joueur, interactions avec les items, et mises à jour de l'état du jeu.
// Utilise le modèle RoomBuilder pour accéder à l'état actuel de la pièce et agir en conséquence.

// GameEngine coordonne toutes les différentes composantes du jeu, comme les pièces (rooms), les items, les interactions du joueur, etc. Il agira comme un orchestrateur, gérant le flux de jeu, les événements, et les états.

// Initialisation du Jeu : Démarrer le jeu, initialiser les composants, et préparer le terrain de jeu.
// Gestion des Événements : Gérer les événements du jeu, comme les mouvements du joueur, les interactions avec les items, etc.
// Mise à Jour du Jeu : Mettre à jour l'état du jeu en fonction des actions du joueur et des événements du jeu.
// Rendu du Jeu : Coordonner le rendu des éléments du jeu (pièces, items, joueur) sur l'écran.
// Gestion des États : Garder une trace de l'état du jeu (en cours, gagné, perdu, etc.).

// GameEngine centralise la logique principale du jeu. Elle gère l'initialisation, les événements, la mise à jour des états, et le rendu du jeu. 
// Séparation des responsabilités entre la génération des pièces (RoomGenerator), la gestion des items (ItemManager), et le moteur de jeu global (GameEngine), 

// =>>>    agit comme un orchestrateur.

// constructor(config) : Initialise la configuration du jeu, les données de la pièce courante, les items, et le joueur.

// initializeGame() : Cette méthode initialise toutes les composantes du jeu, y compris les pièces, les items, et le joueur. Elle appelle ensuite startGame() pour démarrer le jeu.

// initializeRooms() : Utilise le RoomGenerator pour créer la pièce initiale où se trouve le joueur.

// initializeItems() : Initialise les items dans le jeu en utilisant la classe ItemManager.

// initializePlayer() : Initialise la position, la vie, et l'inventaire du joueur.

// startGame() : Lance le jeu en rendant la carte initiale et en liant les événements.

// bindEvents() : Attache les événements nécessaires (comme les touches du clavier) pour interagir avec le jeu.

// handleKeydown(event) : Gère les événements de touches clavier pour déplacer le joueur.

// movePlayer(deltaX, deltaY) : Déplace le joueur dans la pièce et vérifie s'il y a des items à ramasser.

// isPositionValid(x, y) : Vérifie si la position du joueur est valide (à l'intérieur de la pièce).

// checkForItems() : Vérifie si le joueur se trouve sur une cellule contenant un item et déclenche la collecte de l'item.

// handleItemPickup(item) : Gère la collecte d'un item par le joueur, en l'ajoutant à son inventaire et en le retirant de la pièce.

// renderGame() : Rend la carte du jeu et le joueur.

// renderPlayer() : Rende visuellement la position du joueur sur la carte.

// Exemple de configuration initiale pour le jeu
// const gameConfig = {
//     initialRoomData: { 
//         id: 1, 
//         name: "Initial Room", 
//         nb_rows: 10, 
//         nb_cols: 10, 
//         cell_size: 50, 
//         start_x: 2, 
//         start_y: 2 
//     },
//     itemsData: [
//         { id: 1, name: "Sword", description: "A sharp blade", img: "/images/sword.png", effect: "damage", life: 10, value: 100, context: "combat" },
//         { id: 2, name: "Potion", description: "Heals 50 HP", img: "/images/potion.png", effect: "heal", life: 0, value: 50, context: "heal" },
//         // ... autres items
//     ]
// };

// Initialisation et démarrage du moteur de jeu
// const gameEngine = new GameEngine(gameConfig);
// gameEngine.initializeGame();
import { RoomGenerator } from './RoomGenerator.js';
import { ItemManager } from './ItemManager.js';

export class GameEngine {
    constructor(config) {
        this.config = config; // Configuration initiale du jeu (dimensions, niveaux, etc.)
        this.currentRoom = null; // La pièce actuelle où se trouve le joueur
        this.itemManager = null; // Le gestionnaire des items
        this.player = null; // Le joueur
    }

    // Initialisation du jeu
    initializeGame() {
        console.log("Initialisation du jeu...");

        // Initialisation des composants du jeu
        this.initializeRooms();
        this.initializeItems();
        this.initializePlayer();

        // Démarrer le jeu
        this.startGame();
    }

    // Initialisation des pièces (rooms)
    initializeRooms() {
        const roomData = this.config.initialRoomData; // Récupération des données de la pièce initiale
        const roomGenerator = new RoomGenerator(roomData); // Utilisation de RoomGenerator pour créer la pièce
        this.currentRoom = roomGenerator.generateRoom();
        console.log("Pièce initialisée:", this.currentRoom);
    }

    // Initialisation des items
    initializeItems() {
        const itemsData = this.config.itemsData;
        this.itemManager = new ItemManager(itemsData);
        this.itemManager.initializeItems();
        console.log("Items initialisés:", this.itemManager.items);
    }

    // Initialisation du joueur
    initializePlayer() {
        this.player = {
            x: this.currentRoom.roomData.start_x,
            y: this.currentRoom.roomData.start_y,
            life: 100,
            inventory: []
        };
        console.log("Joueur initialisé:", this.player);
    }

    // Méthode pour démarrer le jeu
    startGame() {
        console.log("Démarrage du jeu...");
        this.renderGame();
        this.bindEvents();
    }

    // Liaison des événements (clavier, souris, etc.)
    bindEvents() {
        document.addEventListener("keydown", (event) => this.handleKeydown(event));
    }

    // Gestion des touches clavier pour déplacer le joueur
    handleKeydown(event) {
        switch (event.key) {
        case "ArrowUp":
            this.movePlayer(0, -1);
            break;
        case "ArrowDown":
            this.movePlayer(0, 1);
            break;
        case "ArrowLeft":
            this.movePlayer(-1, 0);
            break;
        case "ArrowRight":
            this.movePlayer(1, 0);
            break;
        default:
            break;
        }
    }

    // Déplacer le joueur dans la pièce
    movePlayer(deltaX, deltaY) {
        const newX = this.player.x + deltaX;
        const newY = this.player.y + deltaY;

        if (this.isPositionValid(newX, newY)) {
            this.player.x = newX;
            this.player.y = newY;
            console.log(`Joueur déplacé à (${this.player.x}, ${this.player.y})`);
            this.checkForItems();
            this.renderGame();
        } else {
            console.log("Mouvement invalide");
        }
    }

    // Vérifie si la position du joueur est valide (dans les limites de la pièce)
    isPositionValid(x, y) {
        return x >= 0 && x < this.currentRoom.roomData.nb_cols &&
               y >= 0 && y < this.currentRoom.roomData.nb_rows;
    }

    // Vérifie s'il y a des items à la position actuelle du joueur
    checkForItems() {
        const item = this.itemManager.items.find(item => 
            item.position.x === this.player.x && item.position.y === this.player.y
        );
        if (item) {
            console.log(`Item trouvé: ${item.name}`);
            this.handleItemPickup(item);
        }
    }

    // Gère la collecte d'un item par le joueur
    handleItemPickup(item) {
        this.player.inventory.push(item);
        console.log(`Item ajouté à l'inventaire: ${item.name}`);
        this.itemManager.removeItem(item.id);
        this.renderGame();
    }

    // Met à jour et rend la carte de jeu
    renderGame() {
        console.log("Rendu du jeu...");
        this.currentRoom.renderMap();
        this.renderPlayer();
    }

    // Rendre le joueur sur la carte
    renderPlayer() {
        const playerElement = document.createElement("div");
        playerElement.style.position = "absolute";
        playerElement.style.left = `${this.player.x * this.currentRoom.roomData.cell_size}px`;
        playerElement.style.top = `${this.player.y * this.currentRoom.roomData.cell_size}px`;
        playerElement.style.width = `${this.currentRoom.roomData.cell_size}px`;
        playerElement.style.height = `${this.currentRoom.roomData.cell_size}px`;
        playerElement.style.backgroundColor = "#ff0000"; // Représente le joueur en rouge
        document.getElementById("map-container").appendChild(playerElement);
    }
}


