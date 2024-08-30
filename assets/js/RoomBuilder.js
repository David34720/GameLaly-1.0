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

// initMap : Initialise la carte en créant les cellules, en les affichant et en configurant les événements nécessaires.
// createCells : Génère les cellules selon les données fournies (roomData).
// renderMap : Affiche les cellules de la carte dans le conteneur principal.
// onCellClick : Gère les clics sur les cellules, permettant de sélectionner une cellule, de supprimer une cellule, ou de placer un item.
// selectCell : Sélectionne une cellule et affiche ses détails sur la droite.
// placeItemInCell : Place un item dans une cellule spécifique.
// deleteCell : Supprime une cellule, en la réinitialisant visuellement et dans les données.
// renderItemInCell : Affiche l'item dans une cellule spécifique.
// renderItemList : Affiche la liste des items disponibles pour le placement.
// highlightSelectedItem : Met en évidence l'item sélectionné dans la liste.
// showCellDetails : Affiche les détails d'une cellule sélectionnée dans un conteneur à droite.
// setupEventListeners : Configure les événements pour activer/désactiver le mode suppression.
export class RoomBuilder {
    constructor(roomData, items) {
        this.roomData = roomData; // Les données brutes pour générer la pièce
        this.items = items; // Liste des items disponibles
        this.cells = []; // Liste des cellules générées
        this.selectedItem = null; // Item actuellement sélectionné pour le placement
        this.isDeleteMode = false; // Mode suppression désactivé par défaut
    }

    // Méthode pour initialiser la carte de la pièce
    initMap() {
        console.log('items **********', this.items);
        
        this.createCells();
        this.renderMap();
        this.renderItemList(); // Afficher la liste des items disponibles
        this.setupEventListeners(); // Mettre en place les écouteurs d'événements pour le mode suppression et sélection d'items
    }

    // Méthode pour créer les cellules en fonction des données de la pièce
    createCells() {
        const { nb_rows, nb_cols, cell_size } = this.roomData;
        
        

        // Génération des cellules pour chaque position dans la grille
        for (let y = 0; y < nb_rows; y++) {
            console.log('y', y);
            
            for (let x = 0; x < nb_cols; x++) {
                console.log('x', x);
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
            cellElement.className = "cell";
            
            // Utilisation de grid pour gérer les positions
            cellElement.style.gridColumnStart = cell.posX + 1; // +1 car CSS Grid commence à 1
            cellElement.style.gridRowStart = cell.posY + 1;
            cellElement.style.width = `${this.roomData.cell_size}px`;
            cellElement.style.height = `${this.roomData.cell_size}px`;
            cellElement.style.boxSizing = "border-box";
            cellElement.style.border = "1px solid #ccc";
    
            if (cell.exists) {
                cellElement.style.backgroundColor = "#007bff"; // Couleur des cellules existantes
                if (cell.item) {
                    this.renderItemInCell(cellElement, cell.item);
                }
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
        if (this.isDeleteMode) {
            if (cell.exists) {
                this.deleteCell(cell);
            }
        } else if (this.selectedItem) {
            this.placeItemInCell(cell, this.selectedItem.id);
        } else {
            this.selectCell(cell);
        }
    }

    // Méthode pour sélectionner une cellule et afficher son contenu
    selectCell(cell) {
        console.log(`Cellule sélectionnée (${cell.posX}, ${cell.posY})`);
        if (cell.exists && cell.item) {
            const item = this.items.find(item => item.id === cell.item);
            this.highlightSelectedItem(item);
            this.showCellDetails(cell);
        } else {
            console.log("Cellule vide.");
        }
    }

    // Méthode pour afficher un item dans une cellule spécifique
    placeItemInCell(cell, itemId) {
        if (!cell.exists) {
            cell.exists = true;
        }
        cell.item = itemId;
        this.renderMap(); // Re-rendre la carte pour afficher l'item
    }

    // Méthode pour supprimer une cellule
    deleteCell(cell) {
        cell.exists = false;
        cell.item = null;
        cell.message = null;
        this.renderMap(); // Re-rendre la carte pour enlever la cellule
    }

    // Méthode pour rendre un item dans une cellule (visuellement)
    renderItemInCell(cellElement, itemId) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            const itemElement = document.createElement("img");
            itemElement.src = item.img;
            itemElement.alt = item.name;
            itemElement.title = item.description;
            itemElement.style.position = "relative"; // Position relative pour une meilleure intégration
            itemElement.style.width = "100%";
            itemElement.style.height = "100%";
            cellElement.appendChild(itemElement);
        } else {
            console.error(`Item avec ID ${itemId} non trouvé.`);
        }
    }

    // Méthode pour rendre la liste des items disponibles à gauche
    renderItemList() {
        const itemListContainer = document.getElementById("item-list");
        itemListContainer.innerHTML = ""; // Vider le conteneur
        console.log('Rendering item list...', this.items);
        
        this.items.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.className = "item d-flex align-items-start mb-2"; // Bootstrap classes for layout
    
            // Ajout d'une image, nom et description tronquée
            itemElement.innerHTML = `
                <img src="${item.img}" alt="${item.name}" title="${item.description}" class="item-thumbnail me-2" />
                <div class="item-details">
                    <h6 class="item-name mb-1">${item.name}</h6>
                    <p class="item-description text-muted mb-0">${this.truncateText(item.description, 40)}</p>
                </div>
            `;
            
            itemElement.addEventListener('click', () => {
                this.selectedItem = item;
                console.log(`Item sélectionné: ${item.name}`);
            });
    
            itemListContainer.appendChild(itemElement);
        });
    }
    
    // Méthode pour tronquer la description
    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // Méthode pour mettre en évidence l'item sélectionné dans la liste
    highlightSelectedItem(item) {
        const itemListContainer = document.getElementById("item-list");
        Array.from(itemListContainer.children).forEach(child => {
            child.classList.remove("selected-item");
            if (child.querySelector(`img[alt="${item.name}"]`)) {
                child.classList.add("selected-item");
            }
        });
    }

    // Méthode pour afficher les détails de la cellule à droite
    showCellDetails(cell) {
        const detailsContainer = document.getElementById("cell-details");
        detailsContainer.innerHTML = `
            <p>Position: (${cell.posX}, ${cell.posY})</p>
            <p>Item ID: ${cell.item || "Aucun"}</p>
            <p>Message ID: ${cell.message || "Aucun"}</p>
        `;
    }

    // Méthode pour configurer les écouteurs d'événements
    setupEventListeners() {
        const deleteModeButton = document.getElementById("delete-mode-button");
        deleteModeButton.addEventListener('click', () => {
            this.isDeleteMode = !this.isDeleteMode;
            deleteModeButton.classList.toggle("active", this.isDeleteMode);
            console.log(`Mode suppression: ${this.isDeleteMode ? "Activé" : "Désactivé"}`);
        });
    }
}
