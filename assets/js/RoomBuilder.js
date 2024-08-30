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
        this.roomData = roomData;
        this.items = items;
        this.cells = [];
        this.selectedItem = null;
        this.mode = 'select'; // Mode initial
        this.previousMode = this.mode; // Stocker le mode précédent
        this.selectedCells = new Set();
        this.isMouseDown = false;
        this.isSaving = false; // Indicateur pour empêcher les sauvegardes répétées
        this.isPanning = false; // Nouveau flag pour le mode "pan"
        this.startPanPosition = { x: 0, y: 0 }; // Pour stocker la position initiale de la souris
    }

    initMap() {
        this.createCells();
        this.renderMap();
        this.renderItemList();
        this.setupEventListeners();
        this.updateModeUI();

        const mapContainer = document.getElementById("map-container");
        mapContainer.addEventListener('mouseleave', () => this.onMouseUp());

        // Centrer la vue sur la cellule de départ
        this.centerMapOnStart();

        // Activer le mode "pan" au clic sur la barre d'espace
        this.setupPanMode();
    }

    createCells() {
        const { nb_rows, nb_cols, cell_size } = this.roomData;
        for (let y = 0; y < nb_rows; y++) {
            for (let x = 0; x < nb_cols; x++) {
                const cell = {
                    x: x * cell_size,
                    y: y * cell_size,
                    posX: x,
                    posY: y,
                    exists: false,
                    item: null,
                    message: null
                };
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

    renderMap() {
        const mapContainer = document.getElementById("map-container");
        mapContainer.innerHTML = "";

        mapContainer.style.display = "grid";
        mapContainer.style.gridTemplateColumns = `repeat(${this.roomData.nb_cols}, ${this.roomData.cell_size}px)`;
        mapContainer.style.gridTemplateRows = `repeat(${this.roomData.nb_rows}, ${this.roomData.cell_size}px)`;

        this.cells.forEach(cell => {
            const cellElement = document.createElement("div");
            cellElement.className = "cell";
            cellElement.style.width = `${this.roomData.cell_size}px`;
            cellElement.style.height = `${this.roomData.cell_size}px`;
            cellElement.style.boxSizing = "border-box";
            cellElement.style.border = "1px solid #ccc";

            if (cell.exists) {
                cellElement.style.backgroundColor = "#007bff";
                if (cell.item) {
                    this.renderItemInCell(cellElement, cell.item);
                }
            } else {
                cellElement.style.backgroundColor = "#fff"; 
            }

            mapContainer.appendChild(cellElement);

            cellElement.addEventListener('mousedown', () => this.onMouseDown(cell, cellElement));
            cellElement.addEventListener('mouseover', () => this.onMouseOver(cell, cellElement));
        });

        document.addEventListener('mouseup', () => this.onMouseUp());
    }

    centerMapOnStart() {
        const { start_x, start_y, cell_size } = this.roomData;
        const mapContainer = document.getElementById("map-container");

        // Calculer la position centrale en fonction du start_x et start_y
        const centerX = start_x * cell_size - (mapContainer.clientWidth / 2) + (cell_size / 2);
        const centerY = start_y * cell_size - (mapContainer.clientHeight / 2) + (cell_size / 2);

        // Appliquer le défilement
        mapContainer.scrollTo({
            left: Math.max(centerX, 0), // Pour éviter de scroller en dehors des limites à gauche
            top: Math.max(centerY, 0),  // Pour éviter de scroller en dehors des limites en haut
            behavior: 'smooth' // Pour un défilement doux
        });
    }

    setupPanMode() {
        document.addEventListener('keydown', (event) => {
            // Utiliser la touche Shift pour activer le mode pan
            if (event.key === 'Shift' && !this.isPanning) {
                this.isPanning = true;
                this.previousMode = this.mode; // Sauvegarder le mode précédent
                this.mode = 'pan'; // Basculer en mode "pan"
                document.body.style.cursor = 'grab'; // Changer le curseur en "main"
            }
        });
    
        document.addEventListener('keyup', (event) => {
            if (event.key === 'Shift' && this.isPanning) {
                this.isPanning = false;
                this.mode = this.previousMode; // Restaurer le mode précédent
                document.body.style.cursor = 'default'; // Réinitialiser le curseur
            }
        });
    
        const mapContainer = document.getElementById("map-container");
    
        mapContainer.addEventListener('mousedown', (event) => {
            if (this.isPanning) {
                this.isMouseDown = true;
                this.startPanPosition = {
                    x: event.clientX,
                    y: event.clientY
                };
                document.body.style.cursor = 'grabbing'; // Changer le curseur en "main en action"
            }
        });
    
        mapContainer.addEventListener('mousemove', (event) => {
            if (this.isMouseDown && this.isPanning) {
                const dx = event.clientX - this.startPanPosition.x;
                const dy = event.clientY - this.startPanPosition.y;
    
                mapContainer.scrollLeft -= dx;
                mapContainer.scrollTop -= dy;
    
                this.startPanPosition = {
                    x: event.clientX,
                    y: event.clientY
                };
            }
        });
    
        mapContainer.addEventListener('mouseup', () => {
            if (this.isPanning) {
                this.isMouseDown = false;
                document.body.style.cursor = 'grab'; // Revenir au curseur "main"
            }
        });
    
        mapContainer.addEventListener('mouseleave', () => {
            if (this.isPanning) {
                this.isMouseDown = false;
                document.body.style.cursor = 'grab'; // Revenir au curseur "main"
            }
        });
    }
    

    onMouseDown(cell, cellElement) {
        this.isMouseDown = true;
        this.handleCellInteraction(cell, cellElement);
        cellElement.classList.add('hovered');
    }

    onMouseOver(cell, cellElement) {
        if (!this.isMouseDown) return; 
        this.handleCellInteraction(cell, cellElement);
        cellElement.classList.add('hovered');
    }

    onMouseUp() {
        this.isMouseDown = false;
        this.clearHoveredCells();
        this.saveSelectedCells(); 
    }

    clearHoveredCells() {
        const hoveredCells = document.querySelectorAll('.cell.hovered');
        hoveredCells.forEach(cell => cell.classList.remove('hovered'));
    }

    handleCellInteraction(cell, cellElement) {
        if (this.mode === 'pan') {
            // Ne rien faire, le mode de défilement est actif
            return;
        }

        const cellKey = `${cell.posX}-${cell.posY}`;

        if (this.mode === 'select') {
            this.selectCell(cell);
            return;
        }

        if (this.mode === 'insert' && this.selectedItem) {
            this.placeItemInCell(cell, this.selectedItem.id);
            this.selectedCells.add(cellKey);
            cellElement.style.backgroundColor = "#007bff"; // Changement de couleur immédiat pour l'insertion
        } else if (this.mode === 'delete' && cell.exists) {
            this.deleteCell(cell);
            this.selectedCells.add(cellKey);
            cellElement.style.backgroundColor = "#fff"; // Changement de couleur immédiat pour la suppression
        }
    }

    selectCell(cell) {
        console.log(`Sélection de la cellule : (${cell.posX}, ${cell.posY})`);
        this.showCellDetails(cell);
        if (cell.exists && cell.item) {
            this.highlightSelectedItem(this.items.find(item => item.id === cell.item));
        }
    }

    showCellDetails(cell) {
        const detailsContainer = document.getElementById("cell-details");
        detailsContainer.innerHTML = `
            <p>Position: (${cell.posX}, ${cell.posY})</p>
            <p>Item ID: ${cell.item || "Aucun"}</p>
            <p>Message ID: ${cell.message || "Aucun"}</p>
        `;
    }

    placeItemInCell(cell, itemId) {
        cell.exists = true;
        cell.item = itemId;
        this.updateCellAppearance(cell, false);
    }

    deleteCell(cell) {
        cell.exists = false;
        cell.item = null;
        cell.message = null;
        this.updateCellAppearance(cell, false);
    }

    updateCellAppearance(cell) {
        const cellElement = this.cells.find(c => c.posX === cell.posX && c.posY === cell.posY);
        if (cellElement) {
            if (cell.exists) {
                cellElement.style.backgroundColor = "#007bff";
                cellElement.innerHTML = "";
                if (cell.item) {
                    this.renderItemInCell(cellElement, cell.item);
                }
            } else {
                cellElement.style.backgroundColor = "#fff"; 
                cellElement.innerHTML = "";
            }
        }
    }

    async saveSelectedCells() {
        if (this.selectedCells.size === 0 || this.isSaving) {
            console.warn('Aucune cellule sélectionnée pour la sauvegarde ou sauvegarde déjà en cours.');
            return;
        }

        this.isSaving = true; // Empêche les sauvegardes répétées

        const cellsData = Array.from(this.selectedCells).map(key => {
            const [posX, posY] = key.split('-').map(Number);
            const cell = this.cells.find(c => c.posX === posX && c.posY === posY);

            return {
                room_id: this.roomData.id,
                pos_x: cell.posX,
                pos_y: cell.posY,
                item_id: cell.exists ? cell.item : null,
                message_id: cell.exists ? cell.message : null
            };
        });

        try {
            const response = await fetch('/rooms/save-cells', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cellsData),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erreur lors de la sauvegarde des cellules: ${errorMessage}`);
            }

            console.log('Les cellules ont été sauvegardées avec succès.');
            this.selectedCells.clear();
            this.updateCellsAfterSave(cellsData);
            this.renderMap();
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            this.isSaving = false; // Réinitialise l'indicateur de sauvegarde
        }
    }

    updateCellsAfterSave(cellsData) {
        cellsData.forEach(data => {
            const cell = this.cells.find(c => c.posX === data.pos_x && c.posY === data.pos_y);
            if (cell) {
                cell.exists = data.item_id !== null;
                cell.item = data.item_id;
                cell.message = data.message_id;
            }
        });
    }

    renderItemInCell(cellElement, itemId) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            const itemElement = document.createElement("img");
            itemElement.src = item.img;
            itemElement.alt = item.name;
            itemElement.title = item.description;
            itemElement.style.position = "relative";
            itemElement.style.width = "100%";
            itemElement.style.height = "100%";
            itemElement.draggable = false;
            cellElement.appendChild(itemElement);
        } else {
            console.error(`Item avec ID ${itemId} non trouvé.`);
        }
    }

    renderItemList() {
        const itemListContainer = document.getElementById("item-list");
        itemListContainer.innerHTML = "";
        this.items.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.className = "item d-flex align-items-start mb-2";

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

            itemElement.querySelector("img").draggable = false;

            itemListContainer.appendChild(itemElement);
        });
    }

    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    highlightSelectedItem(item) {
        const itemListContainer = document.getElementById("item-list");
        Array.from(itemListContainer.children).forEach(child => {
            child.classList.remove("selected-item");
            if (child.querySelector(`img[alt="${item.name}"]`)) {
                child.classList.add("selected-item");
            }
        });
    }

    setupEventListeners() {
        const insertModeButton = document.getElementById("toggle-insert-mode-button");
        const deleteModeButton = document.getElementById("toggle-delete-mode-button");
        const selectModeButton = document.getElementById("toggle-select-mode-button");

        insertModeButton.addEventListener('click', () => {
            this.mode = 'insert';
            this.updateModeButtons(insertModeButton, deleteModeButton, selectModeButton);
            this.updateModeUI();
        });

        deleteModeButton.addEventListener('click', () => {
            this.mode = 'delete';
            this.updateModeButtons(insertModeButton, deleteModeButton, selectModeButton);
            this.updateModeUI();
        });

        selectModeButton.addEventListener('click', () => {
            this.mode = 'select';
            this.updateModeButtons(insertModeButton, deleteModeButton, selectModeButton);
            this.updateModeUI();
        });
    }

    updateModeButtons(insertButton, deleteButton, selectButton) {
        insertButton.classList.toggle('active-mode', this.mode === 'insert');
        deleteButton.classList.toggle('active-mode', this.mode === 'delete');
        selectButton.classList.toggle('active-mode', this.mode === 'select');
    }

    updateModeUI() {
        const banner = document.getElementById('mode-banner');
        const body = document.querySelector('body');

        body.classList.remove('mode-insert', 'mode-delete', 'mode-select', 'mode-pan');

        switch (this.mode) {
        case 'insert':
            banner.textContent = "Mode Insertion Activé";
            banner.className = "banner banner-insert";
            body.classList.add('mode-insert');
            break;
        case 'delete':
            banner.textContent = "Mode Suppression Activé";
            banner.className = "banner banner-delete";
            body.classList.add('mode-delete');
            break;
        case 'pan':
            banner.textContent = "Mode Défilement Activé";
            banner.className = "banner banner-pan";
            body.classList.add('mode-pan');
            break;
        case 'select':
        default:
            banner.textContent = "Mode Sélection Activé";
            banner.className = "banner banner-select";
            body.classList.add('mode-select');
            break;
        }
    }
}
