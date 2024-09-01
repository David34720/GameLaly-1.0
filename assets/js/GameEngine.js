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
// gameEngine.js
import { RoomGenerator } from './RoomGenerator.js';
import { ItemManager } from './ItemManager.js';

export class GameEngine {
    constructor(config) {
        if (!config) {
            throw new Error('GameEngine configuration is required.');
        }
        console.log('GameEngine config:', config);
        this.config = config;
        this.currentRoom = null;
        this.itemManager = null;
        this.player = null;
    }

    async initializeGame() {
        await this.initializeRooms(); // Attendre que la salle soit complètement générée
        this.initializeItems();
        this.initializePlayer();
        this.startGame();
    }

    initializeRooms() {
        if (!this.config || !this.config.initialRoomData) {
            throw new Error('Initial room data is missing in the configuration.');
        }
        console.log("Initial room data:", this.config.initialRoomData);
        
        const roomData = this.config.initialRoomData;
        const itemsData = this.config.itemsData || [];
        const roomGenerator = new RoomGenerator(roomData, itemsData);
        
        // Passez la configuration de GameEngine ici
        this.currentRoom = roomGenerator.generateRoom(this.config);
    }
    
    generateRoomAsync(roomGenerator) {
        return new Promise((resolve, reject) => {
            try {
                const room = roomGenerator.generateRoom();
                console.log("Room generated successfully:", room);
                resolve(room);
            } catch (error) {
                console.error("Erreur lors de la génération de la salle:", error);
                reject(error);
            }
        });
    }
    
    initializeItems() {
        const itemsData = this.config.itemsData;
        this.itemManager = new ItemManager(itemsData);
        this.itemManager.initializeItems();
    }
    

    initializePlayer() {
        const playerData = this.config.playerData;
        console.log("Initializing player with data:", playerData);
    
        this.player = {
            x: playerData.pos_x,
            y: playerData.pos_y,
            img: playerData.img || 'default-image.png', // Assurez-vous que l'image est définie
            life: 100,
            inventory: []
        };
    
        if (!this.player.x || !this.player.y) {
            console.error('Error: Player position is undefined or invalid', this.player);
        }
    
        this.renderPlayer();
    }

    startGame() {
        if (!this.currentRoom) {
            console.error("Impossible de démarrer le jeu: la salle n'est pas encore prête.");
            return;
        }
        console.log("Démarrage du jeu avec la salle:", this.currentRoom);
        this.config.mode = 'play'; // Assurez-vous que le mode est défini sur "play"
        this.renderGame();
        this.bindEvents();
    }
    
    bindEvents() {
        document.addEventListener("keydown", (event) => this.handleKeydown(event));
        console.log("Event listener for keydown attached"); // Ajout de ce log pour confirmer l'attachement
    }

    handleKeydown(event) {
        // Vérifiez si le mode actuel est "play" avant de permettre le déplacement du joueur
        if (this.config.mode !== 'play') {
            return;
        }
        
        // Empêche le comportement par défaut des touches fléchées
        switch (event.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
            event.preventDefault(); // Empêche le défilement de la page
            break;
        default:
            break;
        }
    
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
    

    movePlayer(deltaX, deltaY) {
        const newX = this.player.x + deltaX;
        const newY = this.player.y + deltaY;

        if (this.isPositionValid(newX, newY)) {
            this.clearCell(this.player.x, this.player.y); // Restaurer la cellule à son état initial
            this.player.x = newX;
            this.player.y = newY;
            this.renderPlayer();
        } else {
            console.log("Mouvement invalide");
        }
    }

    isPositionValid(x, y) {
        return x >= 0 && x < this.currentRoom.roomData.nb_cols &&
               y >= 0 && y < this.currentRoom.roomData.nb_rows;
    }

    clearCell(x, y) {
        // Logique pour restaurer la cellule à son état initial après que le joueur l'a traversée
        this.currentRoom.updateCellAppearance({
            posX: x,
            posY: y,
            exists: false, // Ou remettre l'état initial
            item: null,
            message: null
        });
    }

    renderGame() {
        this.currentRoom.renderMap();
        this.renderPlayer();
    }

    renderPlayer() {
        let playerElement = document.getElementById("player-element");
        
        if (!playerElement) {
            playerElement = document.createElement("img");
            playerElement.id = "player-element";
            playerElement.src = `/img/items/${this.player.img}` || this.player.img;
            playerElement.style.position = "absolute";
            playerElement.style.width = `${this.currentRoom.roomData.cell_size}px`;
            playerElement.style.height = `${this.currentRoom.roomData.cell_size}px`;
    
            const mapContainer = document.getElementById("map-container");
            mapContainer.appendChild(playerElement);
        }
    
        playerElement.style.left = `${this.player.x * this.currentRoom.roomData.cell_size}px`;
        playerElement.style.top = `${this.player.y * this.currentRoom.roomData.cell_size}px`;
    }
    
}
