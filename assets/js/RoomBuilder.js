console.log("RoomBuilder.js");


// Cette classe construit la pièce en créant et en disposant les cellules en fonction des données fournies par RoomGenerator.
// Ces méthodes s'assurent que chaque cellule est correctement placée et initialisée, avec des items et des messages s'il y en a.
// RoomBuilder est utilisé dans la classe RoomGenerator pour créer et initialiser une pièce.
// constructor(roomData) : Cette méthode initialise l'instance de RoomBuilder avec les données de la pièce fournies. Ces données incluent  le nombre de lignes, de colonnes, la taille des cellules, etc.


//  RoomBuilder est conçue pour prendre les données de la pièce, générer les cellules correspondantes, et gérer leur affichage. Elle est également capable de répondre aux interactions de l'utilisateur, comme les clics sur les cellules, pour afficher des informations supplémentaires (items, messages, etc.).

// initMap() : Cette méthode est appelée pour démarrer la création de la pièce. Elle génère les cellules (createCells()) et les affiche (renderMap()).

// createCells() : Cette méthode crée une liste de cellules pour la pièce en fonction du nombre de lignes (nb_rows) et de colonnes (nb_cols). Chaque cellule a une position (posX, posY), une taille (cell_size), et peut contenir un item ou un message.

// Si une cellule existe déjà (basée sur les données de roomData), elle est marquée comme existante (exists: true), et les informations sur l'item et le message sont associées à la cellule.
// renderMap() : Cette méthode génère l'affichage visuel de la pièce en créant des éléments HTML pour chaque cellule et en les positionnant dans un conteneur. Elle gère également l'affichage des couleurs pour les cellules existantes ou vides.

// onCellClick(cell) : Cette méthode est déclenchée lorsque l'utilisateur clique sur une cellule. Elle affiche des informations sur l'item et le message associés à la cellule cliquée, s'ils existent.

//Exemple :
// const roomData = {
//     nb_rows: 10,
//     nb_cols: 10,
//     cell_size: 50,
//     cells: [
//         { pos_x: 2, pos_y: 3, item_id: 1, message_id: 2 },
//         { pos_x: 4, pos_y: 5, item_id: 3, message_id: null },
//         // ... autres cellules
//     ]
// };

// const roomGenerator = new RoomGenerator(roomData);
// const room = roomGenerator.generateRoom();

export class RoomBuilder {
    constructor(roomData) {
        this.roomData = roomData; // Les données brutes pour générer la pièce
        this.cells = []; // Liste des cellules générées
    }

    // Méthode pour initialiser la carte de la pièce
    initMap() {
        this.createCells();
        this.renderMap();
    }

    // Méthode pour créer les cellules en fonction des données de la pièce
    createCells() {
        const { nb_rows, nb_cols, cell_size } = this.roomData;

        // Génération des cellules pour chaque position dans la grille
        for (let y = 0; y < nb_rows; y++) {
            for (let x = 0; x < nb_cols; x++) {
                const cell = {
                    x: x * cell_size,
                    y: y * cell_size,
                    posX: x,
                    posY: y,
                    exists: false, // Par défaut, la cellule n'existe pas
                    item: null, // Pas d'item au départ
                    message: null // Pas de message au départ
                };

                // Vérification si une cellule existe à cette position
                const existingCell = this.roomData.cells.find(c => c.pos_x === x && c.pos_y === y);
                if (existingCell) {
                    cell.exists = true;
                    cell.item = existingCell.item_id;
                    cell.message = existingCell.message_id;
                }

                this.cells.push(cell);
            }
        }
    }

    // Méthode pour afficher (ou rendre) la carte de la pièce
    renderMap() {
        const mapContainer = document.getElementById("map-container");
        mapContainer.innerHTML = ""; // Vider le conteneur

        this.cells.forEach(cell => {
            const cellElement = document.createElement("div");
            cellElement.style.position = "absolute";
            cellElement.style.left = `${cell.x}px`;
            cellElement.style.top = `${cell.y}px`;
            cellElement.style.width = `${this.roomData.cell_size}px`;
            cellElement.style.height = `${this.roomData.cell_size}px`;
            cellElement.style.boxSizing = "border-box";
            cellElement.style.border = "1px solid #ccc";

            if (cell.exists) {
                cellElement.style.backgroundColor = "#007bff"; // Couleur des cellules existantes
            } else {
                cellElement.style.backgroundColor = "#fff"; // Couleur des cases vides
            }

            mapContainer.appendChild(cellElement);

            // Ajout d'un événement pour gérer le clic sur une cellule
            cellElement.addEventListener('click', () => {
                this.onCellClick(cell);
            });
        });
    }

    // Méthode déclenchée lors du clic sur une cellule
    onCellClick(cell) {
        if (cell.exists) {
            console.log(`Cellule (${cell.posX}, ${cell.posY}) cliquée.`);
            console.log(`Item ID: ${cell.item}`);
            console.log(`Message ID: ${cell.message}`);
            // Logique pour afficher l'item, le message, etc.
        } else {
            console.log(`Cellule vide (${cell.posX}, ${cell.posY}) cliquée.`);
        }
    }
}

