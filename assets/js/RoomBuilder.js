import { GameEngine } from './GameEngine.js';

// Classe RoomBuilder pour générer et gérer l'affichage d'une pièce avec des cellules interactives.
export class RoomBuilder {
    // Constructeur pour initialiser l'instance de RoomBuilder avec les données de la pièce (roomData) et la liste des items (items).
    constructor(roomData, items, gameConfig) {
        if (!roomData) {
            throw new Error('roomData is required');
        }
        if (!items) {
            throw new Error('items are required');
        }
    
        this.roomData = roomData; // Données sur la pièce, incluant le nombre de lignes, colonnes, etc.
        this.items = items; // Liste des items disponibles pour être placés dans les cellules
        this.cells = []; // Tableau pour stocker les cellules de la pièce
        this.selectedItem = null; // Item actuellement sélectionné pour insertion dans une cellule
        this.mode = 'play'; // Mode courant : 'select', 'insert', ou 'delete'
        this.layer = 'element'; // Layer courant : 'objet', 'character', ou 'element'
        this.selectedCells = new Set(); // Ensemble des cellules sélectionnées
        this.isMouseDown = false; // Indicateur pour savoir si la souris est enfoncée
        this.isSaving = false; // Indicateur pour empêcher les sauvegardes répétées
        this.previousMode = null; // stocker le mode précédent pour toggle touch shift et revenir en arrière au keyup
        this.playerPosition = { x: 0, y: 0 }; // Position du joueur (x, y) en pixels
        // Initialisation du GameEngine
        this.gameEngine = new GameEngine(gameConfig);
        this.messagesForRoom = [];
        console.log("RoomBuilder initialized with:", roomData, items);
    }

    // initialise la postion du joueur au démarrage
    initPlayerPosition() {
        const playerPostiionStart_X = this.roomData.start_x;
        const playerPostiionStart_Y = this.roomData.start_y;
        this.playerPosition = { 
            x: playerPostiionStart_X,
            y: playerPostiionStart_Y 
        };
    }

    // Initialise la carte en créant les cellules à partir des données de la pièce, en les affichant dans le conteneur HTML, 
    // et en configurant les événements nécessaires pour les interactions utilisateur.
    initMap() {
        this.createCells(); // Crée les cellules de la pièce en fonction des données fournies (roomData).
        this.renderMap(); // Affiche les cellules sur la carte (dans le conteneur HTML).
        this.renderItemList(); // Affiche la liste des items disponibles pour l'utilisateur.
        this.setupEventListeners(); // Configure les événements utilisateur (clics, modes d'interaction, etc.).
        this.changeMode(('play')); // Met à jour l'affichage de l'interface utilisateur selon le mode actif.
        this.initPlayerPosition(); // Initialise la position du joueur
        this.getMessagesForRoom(); // initialise la liste des messages pour la room
        
        const mapContainer = document.getElementById("map-container");
        mapContainer.addEventListener('mouseleave', () => this.onMouseUp());
        this.centerCell(mapContainer, this.playerPosition.x, this.playerPosition.y); // Centrer la cellule à la position du joueur
    }
    // Centre la cellule spécifiée dans le conteneur de la carte
    centerCell(container, cellX, cellY) {
        const { cell_size } = this.roomData;
        const containerWidth = container.clientWidth; // spécifie width de l'élément HTML, élément du DOM
        const containerHeight = container.clientHeight;

        const cellCenterX = cellX * cell_size + cell_size / 2;
        const cellCenterY = cellY * cell_size + cell_size / 2;

        const scrollLeft = cellCenterX - containerWidth / 2;
        const scrollTop = cellCenterY - containerHeight / 2;

        container.scrollLeft = scrollLeft;
        container.scrollTop = scrollTop;
    }

    async getMessagesForRoom() {
        try {
            const response = await fetch(`/room/get-messages-for-room/${this.roomData.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des messages');
            }
        
            const messages = await response.json();
            this.messagesForRoom = messages;

        } catch (error) {
            console.error('Erreur lors de la récupération des messages de la salle :', error);
        }
    }

    async getMessageForCell(cell_id) {
        if (!cell_id) {
            return { text: '' }; // Retourne un objet vide si l'id est invalide
        }
    
        try {
            const response = await fetch(`/room/get-message-for-cell/${cell_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des messages');
            }
    
            const message = await response.json();
            return message;
    
        } catch (error) {
            console.error('Erreur lors de la récupération des messages de la cellule :', error);
            return { text: '' }; // Retourne un texte vide en cas d'erreur
        }
    }

    


    // Crée les cellules de la carte en fonction des données de la pièce (roomData) fournies lors de l'instanciation.
    // Les cellules sont initialisées avec leur position, leur taille, et les éventuels items ou messages.
    createCells() {
        const { nb_rows, nb_cols, cell_size } = this.roomData;
    
        // Créer 3 layers pour les différents types d'items
        this.layerCharacters = [];
        this.layerObjects = [];
        this.layerElements = [];
    
        for (let y = 0; y < nb_rows; y++) {
            for (let x = 0; x < nb_cols; x++) {
                const baseCell = {
                    x: x * cell_size,
                    y: y * cell_size,
                    size: cell_size,
                    height: 1,
                    width: 1,
                    offset_x: 0,
                    offset_y: 0,
                    posX: x,
                    posY: y,
                    exists: false,
                    item: null,
                    message: null,
                    layer_type: 'default',
                    isObstacle: false // Par défaut, pas d'obstacle
                };
    
                const cellsFinded = this.roomData.cells.filter(c => c.pos_x === x && c.pos_y === y);
    
                if (cellsFinded.length > 0) {
                    cellsFinded.forEach(c => {
                        const cell = { ...baseCell };
                        cell.exists = true;
                        cell.item = c.item_id;
                        cell.message = c.message_id;
                        cell.id = c.id;
    
                        const item = this.items.find(i => i.id === cell.item);
                        if (item) {
                            if (item.item_type === 9) {
                                // Personnage
                                cell.layer_type = 'personnage';
                                this.replaceCellIfExists(this.layerCharacters, cell); // Remplacer si déjà vide
                                this.addCellIfNotExists(this.layerElements, { ...baseCell, layer_type: 'element' });
                                this.addCellIfNotExists(this.layerObjects, { ...baseCell, layer_type: 'object' });
                            } else if (item.is_object) {
                                // Objet
                                cell.layer_type = 'object';
                                cell.height = c.height;
                                cell.width = c.width;
                                cell.offset_x = c.offset_x;
                                cell.offset_y = c.offset_y;
                                this.replaceCellIfExists(this.layerObjects, cell); // Remplacer si déjà vide
                                this.addCellIfNotExists(this.layerElements, { ...baseCell, layer_type: 'element' });
                                this.addCellIfNotExists(this.layerCharacters, { ...baseCell, layer_type: 'personnage' });
    
                                // Si l'objet est un obstacle, marquer la cellule comme obstacle
                                if (item.is_obstacle) {
                                    cell.isObstacle = true;
                                    console.log('Cellule ' + cell.posX + ', ' + cell.posY + ' est un obstacle');
                                }
    
                                // Marquer les cellules couvertes par l'objet
                                this.markCoveredCells(cell);
                            } else {
                                // Élément
                                cell.layer_type = 'element';
                                this.replaceCellIfExists(this.layerElements, cell); // Remplacer si déjà vide
                                this.addCellIfNotExists(this.layerObjects, { ...baseCell, layer_type: 'object' });
                                this.addCellIfNotExists(this.layerCharacters, { ...baseCell, layer_type: 'personnage' });
                            }
                        }
    
                        // Ajouter la cellule à la liste générale des cellules
                        this.cells.push(cell);
                    });
                } else {
                    // Crée une cellule vide pour chaque layer si elle n'existe pas encore
                    const emptyCellElement = { ...baseCell, layer_type: 'element' };
                    const emptyCellObject = { ...baseCell, layer_type: 'object' };
                    const emptyCellCharacter = { ...baseCell, layer_type: 'personnage' };
    
                    // Ajouter la cellule vide dans chaque layer
                    this.addCellIfNotExists(this.layerElements, emptyCellElement);
                    this.addCellIfNotExists(this.layerObjects, emptyCellObject);
                    this.addCellIfNotExists(this.layerCharacters, emptyCellCharacter);
    
                    // Ajouter la cellule vide à la liste générale des cellules
                    this.cells.push(emptyCellElement);
                }
            }
        }
        this.markAllCoveredCells();
    }
    
    // Fonction utilitaire pour ajouter une cellule seulement si elle n'existe pas déjà dans le layer
    addCellIfNotExists(layer, newCell) {
        const exists = layer.some(c => c.posX === newCell.posX && c.posY === newCell.posY);
        if (!exists) {
            layer.push(newCell);
        }
    }
    
    // Fonction utilitaire pour remplacer une cellule vide existante si elle existe
    replaceCellIfExists(layer, newCell) {
        const index = layer.findIndex(c => c.posX === newCell.posX && c.posY === newCell.posY);
        if (index !== -1 && !layer[index].exists) {
            layer[index] = newCell; // Remplacer la cellule vide par celle avec l'item
        } else if (index === -1) {
            layer.push(newCell); // Si elle n'existe pas, on l'ajoute
        }
    }
    
    
    
    
    markAllCoveredCells() {
        // On parcourt uniquement les cellules contenant des objets qui sont des obstacles
        this.layerObjects.forEach(cell => {
            if (cell.isObstacle) {
                this.markCoveredCells(cell); // Marque les cellules couvertes par cet objet
            }
        });
    }
    
    markCoveredCells(cell) {
        const startX = cell.posX;
        const startY = cell.posY;
        const endX = startX + (cell.width || 1);
        const endY = startY + (cell.height || 1);
    
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                // Marquer chaque cellule couverte comme un obstacle
                const coveredCell = this.layerObjects.find(c => c.posX === x && c.posY === y);
                if (coveredCell) {
                    coveredCell.isObstacle = true; // Marquer la cellule comme couverte par un obstacle
                    console.log('Cellule couverte:', coveredCell);
                }
            }
        }
    }
    
    
    // Affiche la carte en créant les éléments HTML pour chaque cellule et en les positionnant dans le conteneur principal.
    // Les cellules existantes sont affichées avec une couleur spécifique et peuvent contenir un item.
    renderMap() {
        const mapContainer = document.getElementById("map-container");
        mapContainer.innerHTML = ""; // Vide le conteneur pour le réinitialiser.

        const mapContainerCharacters = document.createElement("div");
        mapContainerCharacters.id = "map-container-characters";
        mapContainerCharacters.className = "map-layer";
        mapContainer.appendChild(mapContainerCharacters);

        const mapContainerObjects = document.createElement("div");
        mapContainerObjects.id = "map-container-objects";
        mapContainerObjects.className = "map-layer";
        mapContainer.appendChild(mapContainerObjects);

        const mapContainerElements = document.createElement("div");
        mapContainerElements.id = "map-container-elements";
        mapContainerElements.className = "map-layer";
        mapContainer.appendChild(mapContainerElements);

        // Display la carte des personnages
        this.renderLayerMap(this.layerCharacters, mapContainerCharacters, "#FFDD57"); // Personnages
        
        // Display la carte des objets
        this.renderLayerMap(this.layerObjects, mapContainerObjects, "#8FBC8F"); // Objets

        // Display la carte des éléments
        this.renderLayerMap(this.layerElements, mapContainerElements, "#ADD8E6"); // Autres


      
    }
    
    // Fonction utilisée pour afficher un layer particulier
    // Fonction pour afficher un layer particulier (éléments, objets, personnages)
    renderLayerMap(layer, container, color) {
        const { cell_size } = this.roomData;
    
        // On efface d'abord tout ce qui existe dans le container
        container.innerHTML = '';
    
        layer.forEach(cell => {
            const cellElement = document.createElement("div");
            cellElement.className = "cell";
            cellElement.style.width = `${cell_size}px`;
            cellElement.style.height = `${cell_size}px`;
    
            // Utilisation de position absolute pour positionner les cellules
            cellElement.style.position = "absolute";
            cellElement.style.left = `${cell.posX * cell_size}px`;
            cellElement.style.top = `${cell.posY * cell_size}px`;
            cellElement.style.overflow = "visible"; // Permet à l'image de dépasser la cellule
            
            // Afficher l'item si la cellule contient un item
            if (cell.exists && cell.item) {
                this.renderItemInCell(cellElement, cell); // Passer `cell` comme argument ici
            }
    
            container.appendChild(cellElement);
    
            // Ajout des événements d'interaction pour chaque cellule
            cellElement.addEventListener('mousedown', () => this.onMouseDown(cell, cellElement));
            cellElement.addEventListener('mouseover', () => this.onMouseOver(cell, cellElement));
        });
        this.updateLayerInteractivity();
    }
    
    


    // Gère le clic initial sur une cellule, en fonction du mode courant (sélection, insertion, suppression).
  
    onMouseDown(cell, cellElement) {
        this.isMouseDown = true; // Marque le début d'une interaction par clic.
        this.handleCellInteraction(cell, cellElement); // Gère l'interaction avec la cellule.
        cellElement.classList.add('hovered'); // Ajoute une classe CSS pour indiquer que la cellule est survolée.
    }

    // Gère le survol des cellules pendant que la souris est enfoncée
    onMouseOver(cell, cellElement) {
        if (!this.isMouseDown) return; // Ne rien faire si la souris n'est pas enfoncée.
        this.handleCellInteraction(cell, cellElement); // Gère l'interaction avec la cellule en fonction du mode.
        cellElement.classList.add('hovered');
    }

    // Gère la fin du clic
    onMouseUp() {
        if (this.isMouseDown) {
            this.isMouseDown = false; // Marque la fin de l'interaction par clic.
            this.clearHoveredCells(); // Réinitialise les styles de survol.
            this.saveSelectedCells(); // Sauvegarde les cellules sélectionnées.
        }
    }

    // Supprime les styles des cellules survolées pour réinitialiser leur apparence.
    clearHoveredCells() {
        const hoveredCells = document.querySelectorAll('.cell.hovered'); // Sélectionne toutes les cellules survolées.
        hoveredCells.forEach(cell => cell.classList.remove('hovered')); // Supprime la classe CSS indiquant le survol.
    }

    // Gère l'interaction avec une cellule en fonction du mode sélectionné (sélection, insertion, suppression).
    handleCellInteraction(cell, cellElement) {
        const cellKey = `${cell.posX}-${cell.posY}`; // Clé unique pour identifier chaque cellule.
        let layerCells;
        switch (this.layer) {
        case 'element':
            layerCells = this.layerElements;
            break;
        case 'object':
            layerCells = this.layerObjects;
            break;
        case 'character':
            layerCells = this.layerCharacters;
            break;
        default:
            layerCells = this.cells;
            break;
        }
    
        // Vérifie que layerCell existe avant de continuer
        const layerCell = layerCells.find(lCell => lCell.posX === cell.posX && lCell.posY === cell.posY);
        if (!layerCell) {
            console.warn('Aucune cellule trouvée pour cette position.');
            return; // Arrête si la cellule n'est pas trouvée
        }
    
        // Sélection de cellule
        if (this.mode === 'select') {
            console.log('Selected cell:', layerCell);
            this.selectCell(layerCell); // Sélectionne la cellule pour afficher ses détails
            return;
        }
    
        // Insertion d'un item
        if (this.mode === 'insert' && this.selectedItem) {
            this.placeItemInCell(layerCell, this.selectedItem.id); // Insère un item dans la cellule
            this.selectedCells.add(cellKey); // Ajoute la cellule sélectionnée à l'ensemble des cellules à sauvegarder
            cellElement.style.backgroundColor = "#007bff"; // Indication visuelle
        }
        // Suppression d'un item
        else if (this.mode === 'delete' && layerCell.exists) {
            this.deleteCell(layerCell); // Supprime l'item ou le message de la cellule
            this.selectedCells.add(cellKey); // Ajoute la cellule sélectionnée à l'ensemble des cellules à sauvegarder
            cellElement.style.backgroundColor = "#fff"; // Indication visuelle
        }
    }
    
    

    // Met à jour l'apparence d'une cellule spécifique après modification (insertion ou suppression d'item).
    // Met à jour l'apparence d'une cellule spécifique après modification (insertion ou suppression d'item).
    updateCellAppearance(cell) {
        const cellElement = document.querySelector(`.cell[style*="grid-column-start: ${cell.posX + 1};"][style*="grid-row-start: ${cell.posY + 1};"]`);
        if (cellElement) {
            if (cell.exists) {
                cellElement.style.backgroundColor = "#007bff"; // Change la couleur pour les cellules existantes.
                cellElement.innerHTML = ""; // Réinitialise le contenu HTML de la cellule.
                if (cell.item) {
                    this.renderItemInCell(cellElement, cell.item); // Affiche l'item dans la cellule si elle en contient un.
                }
            } else {
                cellElement.style.backgroundColor = "#fff"; // Réinitialise la couleur pour les cellules vides.
                cellElement.innerHTML = ""; // Réinitialise le contenu HTML de la cellule.
            }
        }
    }


    // Sauvegarde les cellules sélectionnées dans la base de données en envoyant une requête au serveur.
    async saveSelectedCells() {
        if (this.selectedCells.size === 0 || this.isSaving) { // Vérifie si des cellules sont sélectionnées et qu'aucune sauvegarde n'est en cours.
            console.warn('Aucune cellule sélectionnée pour la sauvegarde ou suppression ou sauvegarde déjà en cours.');
            return;
        }
        this.isSaving = true; // Empêche les sauvegardes répétées.

        // Selection du layer actif
        let layerCells;
        let layer_type;

        switch (this.layer) {
        case 'element':
            layerCells = this.layerElements;
            layer_type = 'element';
            break;
        case 'object':
            layerCells = this.layerObjects;
            layer_type = 'object';
            break;
        case 'character':
            layerCells = this.layerCharacters;
            layer_type = 'character';
            break;
        default:
            layerCells = this.cells;
            layer_type = 'default';
            break;
        }
    
        const cellsData = Array.from(this.selectedCells).map(key => {
            const [posX, posY] = key.split('-').map(Number); // Récupère les coordonnées de la cellule à partir de la clé.
            // switch ()


            const cell = layerCells.find(c => c.posX === posX && c.posY === posY); // Trouve la cellule correspondante.
            
            return {
                room_id: this.roomData.id, // Identifiant de la pièce.
                pos_x: cell.posX, // Coordonnée X de la cellule.
                pos_y: cell.posY, // Coordonnée Y de la cellule.
                item_id: cell.exists ? cell.item : null, // Identifiant de l'item (null si aucun).
                message_id: cell.exists ? cell.message : null, // Identifiant du message (null si aucun).
                layer_type: layer_type
            };
        });
    
        let url = '/rooms/save-cells'; // URL par défaut pour l'insertion
        let method = 'POST'; // Méthode HTTP par défaut
    
        if (this.mode === 'delete') {
            url = '/rooms/delete-cells'; // URL pour la suppression
            method = 'DELETE'; // Méthode HTTP pour la suppression
        }
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cellsData), // Envoie les données des cellules sélectionnées au serveur.
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erreur lors de la ${this.mode === 'delete' ? 'suppression' : 'sauvegarde'} des cellules: ${errorMessage}`);
            }
    
            console.log(`Les cellules ont été ${this.mode === 'delete' ? 'supprimées' : 'sauvegardées'} avec succès.`);
            this.selectedCells.clear(); // Réinitialise l'ensemble des cellules sélectionnées.
            this.updateCellsAfterSave(cellsData); // Met à jour l'état des cellules après la sauvegarde ou la suppression.
            this.renderMap(); // Réaffiche la carte avec les modifications.
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            this.isSaving = false; // Réinitialise l'indicateur de sauvegarde.
        }
    }
    

    // Met à jour les cellules après la sauvegarde pour refléter les modifications.
    updateCellsAfterSave(cellsData) {
        const layerCells = this.getLayerCells(); // Récupère les cellules du layer actif
        const layerType = this.layer; // Récupère le type de layer actif (element, object, character)
    
        cellsData.forEach(data => {
            // Trouve la cellule dans le layer actuel, en utilisant posX, posY et le layer_type
            const cell = layerCells.find(c => c.posX === data.pos_x && c.posY === data.pos_y && c.layer_type === layerType);
            
            if (cell) {
                // Si l'item_id n'est pas null, on définit exists à true, sinon à false
                cell.exists = data.item_id !== null;
    
                // Met à jour l'item et le message dans la cellule
                cell.item = data.item_id;
                cell.message = data.message_id;
            }
        });
    }
    

    // Sélectionne une cellule et affiche ses détails dans l'interface utilisateur.
    selectCell(cell) {
        console.log(`Sélection de la cellule : (${cell.posX}, ${cell.posY}, ${cell.item})`);
        this.showCellDetails(cell); // Affiche les détails de la cellule sélectionnée.
    
        if (cell.exists && cell.item) {
            const selectedItem = this.items.find(item => item.id === cell.item); // Trouve l'objet item correspondant à l'ID
            if (selectedItem) {
                this.selectedItem = selectedItem; // Définit l'item sélectionné
               
                this.highlightSelectedItem(selectedItem); // Met en évidence l'item dans la liste si besoin
            } else {
                console.error(`Item avec ID ${cell.item} non trouvé.`);
            }
        }
    }
    

    // Affiche les détails de la cellule sélectionnée dans un conteneur HTML.
    // Affiche les détails de la cellule sélectionnée dans un conteneur HTML.
    async showCellDetails(cell) {
        console.log(`Affichage des détails de la cellule : (${cell.posX}, ${cell.posY}, ${cell.item})`);
        const detailsContainer = document.getElementById("cell-details");
    
        if (!detailsContainer) {
            console.error("Le conteneur de détails des cellules est introuvable.");
            return;
        }
    
        // Récupérer le message pour cette cellule
        const messageForCell = await this.getMessageForCell(cell.id);
       
    
        // Si le message est vide ou absent, afficher un texte par défaut
        const messageContent = messageForCell ? messageForCell.text : 'Aucun message trouvé pour cette cellule';
    
        // Injecter le contenu HTML
        detailsContainer.innerHTML = `
            <form id="cell-edit-form">
                <input type="hidden" name="room_id" value="${this.roomData.id}">
                <input type="hidden" name="pos_x" value="${cell.posX}">
                <input type="hidden" name="pos_y" value="${cell.posY}">
                <input type="hidden" name="layer_type" value="${cell.layer_type}">
                <input type="hidden" name="cell_id" value="${cell.id}">
                
                <!-- Sélection de l'item -->
                <div class="mb-3">
                    <span class="badge bg-info p-3">Sélection de l'item ${cell.id}</span>
                </div>
                <div class="mb-3">
                  <label for="item_id" class="form-label">Item</label>
                  <select class="form-select" id="item-id" name="item_id">
                    <option value="">Aucun</option>
                    ${this.items.map(item => `
                      <option value="${item.id}" ${cell.item === item.id ? 'selected' : ''}>${item.name}</option>
                    `).join('')}
                  </select>
                </div>
                
                <!-- Position de la cellule -->
                <div class="mb-3">
                    <label for="position" class="form-label">Position (x, y)</label>
                    <input type="text" class="form-control" id="position" name="position" value="(${cell.posX}, ${cell.posY})" readonly>
                </div>
                
                <!-- Largeur et hauteur avec des barres de défilement -->
                ${cell.layer_type === 'object' ? `
                <!-- Largeur et hauteur uniquement pour les objets -->
                <div class="mb-3">
                    <label for="width" class="form-label">Largeur</label>
                    <div class="d-flex align-items-center">
                        <input type="range" class="form-range" id="width" name="width" min="1" max="10" value="${cell.width}">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="height" class="form-label">Hauteur</label>
                    <div class="d-flex align-items-center">
                        <input type="range" class="form-range" id="height" name="height" min="1" max="10" value="${cell.height}">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="height" class="form-label">Position Horizontale</label>
                    <div class="d-flex align-items-center">
                        <input type="range" class="form-range" id="offset_x" name="offset_x" min="0" max="${cell.size}" value="${cell.offset_x}">
                    </div>
                </div>
                <div class="mb-3">
                    <label for="height" class="form-label">Position Horizontale</label>
                    <div class="d-flex align-items-center">
                        <input type="range" class="form-range" id="offset_y" name="offset_y" min="0" max="${cell.size}" value="${cell.offset_y}">
                    </div>
                </div>
                ` : ''}
            </form>
    
            <!-- Message -->
            <form id="message-form">
                <input type="hidden" name="cell_id" value="${cell.id}">
                <div class="mb-3">
                    <label for="messageContent" class="form-label">Message</label>
                    <textarea class="form-control" id="messageContent" name="messageContent" rows="4">${messageContent}</textarea>
                </div>
                <button type="submit" class="btn btn-primary" id="save-message-btn" >Sauvegarder</button>
            </form>
        `;
    
        // Assurez-vous que le HTML est injecté avant d'appeler les écouteurs d'événements
        this.attachFormListeners(cell.layer_type);
        this.messageCellSubmitForm();
    }
    


    // Fonction pour attacher les écouteurs aux éléments du formulaire
    attachFormListeners(layer_type) {
        const form = document.getElementById('cell-edit-form');
    
        if (!form) {
            console.error('Le formulaire de la cellule est introuvable.');
            return;
        }
        if (layer_type === 'object') {
            // Synchroniser les champs de largeur et hauteur avec les sliders
            const widthSlider = document.getElementById('width');
            const heightSlider = document.getElementById('height');
            
            if (widthSlider) {
                widthSlider.addEventListener('input', () => {
                    this.autoSubmitForm(form);
                });
            } else {
                console.warn('Le slider de largeur est introuvable.');
            }
            
            if (heightSlider) {
                heightSlider.addEventListener('input', () => {
                    this.autoSubmitForm(form);
                });
            } else {
                console.warn('Le slider de hauteur est introuvable.');
            }
            
        }
        // Soumission automatique lorsque l'utilisateur modifie le formulaire
        form.addEventListener('change', () => {
            this.autoSubmitForm(form);
        });

        // soumission du form message dans cell détail
        const btnSaveMessageCell = document.getElementById('message-form');
        btnSaveMessageCell.addEventListener('submit', (event) => {
            event.preventDefault();
            this.messageCellSubmitForm();
        })
    }
    

    async autoSubmitForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        console.log('data', data);
        try {
            const response = await fetch('/room/update-cell', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de la cellule');
            }
            
            let layerCells;
            switch (data.layer_type) {
            case 'element':
                layerCells = this.layerElements;
                break;
            case 'object':
                layerCells = this.layerObjects;
                break;
            case 'character':
                layerCells = this.layerCharacters;
                break;
            default:
                layerCells = this.cells;
                break;
            }
    
            // Vérifiez si la cellule fait partie du layer courant
            const layerCell = layerCells.find(lCell => lCell.posX === Number(data.pos_x) && lCell.posY === Number(data.pos_y));

            console.log('layerCell', layerCell);
            this.placeItemInCell(layerCell, data.item_id); // Insère un item dans la cellule


            this.renderMap();
    
            
        } catch (error) {
            console.error('Erreur lors de la soumission automatique du formulaire :', error);
        }

    }

    async messageCellSubmitForm() {
        const messageForm = document.getElementById('message-form');
        const formData = new FormData(messageForm);
        const data = Object.fromEntries(formData);
    
        // Vérification si le contenu du message est bien présent
        if (!data.messageContent || data.messageContent.trim() === '') {
            
            return; // Ne pas envoyer la requête si le contenu est vide
        }
    
        try {
            const response = await fetch('/room/update-cell-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du message de la cellule');
            }
    
           
        } catch (error) {
            console.error('Erreur lors de la soumission automatique du formulaire :', error);
        }
    }
    
    

    // Place un item dans une cellule spécifique et met à jour son apparence.
    placeItemInCell(cell, itemId) {
     
        cell.exists = true; // Marque la cellule comme existante.
        cell.item = itemId; // Associe l'item sélectionné à la cellule.
        this.updateCellAppearance(cell, false); // Met à jour l'apparence de la cellule.
    }

    // Supprime un item ou un message d'une cellule spécifique et met à jour son apparence.
    deleteCell(cell) {
      
        cell.exists = false; // Marque la cellule comme vide.
        cell.item = null; // Supprime l'item de la cellule.
        cell.message = null; // Supprime le message de la cellule.
        this.updateCellAppearance(cell); // Met à jour l'apparence de la cellule.
       
    }


    // Affiche un item dans une cellule spécifique en utilisant son élément HTML.
    renderItemInCell(cellElement, cell) {
        const item = this.items.find(item => item.id === Number(cell.item)); // Trouve l'item correspondant.
        if (item) {
            // Supprime l'ancienne image s'il y en a déjà une dans ce cellElement
            while (cellElement.firstChild) {
                cellElement.removeChild(cellElement.firstChild);
            }
    
            const itemElement = document.createElement("img"); // Crée un élément image pour l'item.
            itemElement.src = item.img; // Définit la source de l'image.
            itemElement.alt = item.name; // Définit l'alt pour l'accessibilité.
            itemElement.title = item.description; // Définit le titre pour afficher la description au survol.
    
            // Appliquer les dimensions de l'image en fonction de la taille de l'objet
            itemElement.style.position = "absolute"; // Permet à l'image de dépasser la cellule
            itemElement.style.width = `${cell.width * cell.size}px`; // Appliquer la largeur de l'objet
            itemElement.style.height = `${cell.height * cell.size}px`; // Appliquer la hauteur de l'objet
    
            // Appliquer les offsets (décalages) pour positionner l'image correctement
            itemElement.style.left = `${cell.offset_x}px`; // Décalage horizontal
            itemElement.style.top = `${cell.offset_y}px`; // Décalage vertical
    
            // Désactiver le glisser-déposer par défaut de l'image
            itemElement.draggable = false; 
            
            // Ajouter l'image à la cellule
            cellElement.appendChild(itemElement);
        } else {
            console.error(`Item avec ID ${cell.item} non trouvé.`);
        }
    }
    
    

    // Affiche la liste des items disponibles pour être placés dans les cellules.
    renderItemList() {
        const itemListContainer = document.getElementById("item-list");
        itemListContainer.innerHTML = ""; // Vide la liste des items pour la réinitialiser.
    
        let itemsForLayer = [];
    
        // Filtrer les items en fonction du layer actif
        switch (this.layer) {
        case 'object':
            itemsForLayer = this.items.filter(item => item.is_object); // Items où is_object est vrai
            break;
    
        case 'character':
            itemsForLayer = this.items.filter(item => item.item_type === 9); // Items où item_type est 9 (personnages)
            break;
    
        case 'element':
            itemsForLayer = this.items.filter(item => !item.is_object && item.item_type !== 9); // Les autres items
            break;
    
        default:
            itemsForLayer = this.items; // Par défaut, on affiche tous les items
            break;
        }
    
        console.log('Items pour cette couche:', itemsForLayer);
    
        // Crée les éléments HTML pour chaque item filtré
        itemsForLayer.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.className = "item d-flex align-items-start mb-2";
    
            itemElement.innerHTML = `
                <img src="${item.img}" alt="${item.name}" title="${item.description}" class="item-thumbnail me-2" />
                <div class="item-details">
                    <h6 class="item-name mb-1">${item.name}</h6>
                    <p class="item-description text-muted mb-0">${this.truncateText(item.description, 40)}</p>
                </div>
            `;
    
            // Ajoute un écouteur de clic pour sélectionner l'item
            itemElement.addEventListener('click', () => {
                this.selectedItem = item; // Définit l'item sélectionné lors du clic
                this.updateModeUI();
            });
    
            itemElement.querySelector("img").draggable = false; // Empêche le glisser-déposer de l'image
    
            itemListContainer.appendChild(itemElement); // Ajoute l'item à la liste des items disponibles
        });
    }
    

    // Troncature des textes trop longs dans la liste des items.
    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // Met en évidence l'item sélectionné dans la liste des items disponibles.
    highlightSelectedItem(item) {
        const itemListContainer = document.getElementById("item-list");
        Array.from(itemListContainer.children).forEach(child => {
            child.classList.remove("selected-item"); // Supprime la mise en évidence des autres items.
            if (child.querySelector(`img[alt="${item.name}"]`)) {
                child.classList.add("selected-item"); // Met en évidence l'item sélectionné.
            }
        });
    }

    // Configure les événements pour changer de mode (insertion, suppression, sélection) et met à jour l'interface utilisateur.


    // Configure les événements pour changer de mode (insertion, suppression, sélection) et met à jour l'interface utilisateur.
    setupEventListeners() {
        const playModeButton = document.getElementById("toggle-play-mode-button");
        const insertModeButton = document.getElementById("toggle-insert-mode-button");
        const deleteModeButton = document.getElementById("toggle-delete-mode-button");
        const selectModeButton = document.getElementById("toggle-select-mode-button");
        const mapContainer = document.getElementById("map-container");
    
        // Écouteurs pour les boutons de mode
        playModeButton.addEventListener('click', async () => {
            
            // Appeler initializeGame et attendre qu'il termine
            try {
                await this.gameEngine.initializeGame();
            } catch (error) {
                console.error("Erreur lors de l'initialisation du jeu:", error);
            }
            this.changeMode('play');
        });
    
        insertModeButton.addEventListener('click', () => {
            this.changeMode('insert');
            this.updateModeUI();
        });
    
        deleteModeButton.addEventListener('click', () => {
            this.changeMode('delete');
            this.updateModeUI();
        });
    
        selectModeButton.addEventListener('click', () => {
            this.changeMode('select');
            this.updateModeUI();
        });
    
        // Ajout des événements pour la touche Shift (mode grab)
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Shift') {
                if (this.mode !== 'grab') {
                    this.previousMode = this.mode; // Sauvegarde du mode actuel
                    this.changeMode('grab'); // Passe en mode "grab"
                    this.updateModeUI();
                }
            }
        });
    
        document.addEventListener('keyup', (event) => {
            if (event.key === 'Shift' && this.mode === 'grab') {
                this.changeMode(this.previousMode); // Restaure le mode précédent
                this.previousMode = null; // Réinitialise le mode précédent
                this.updateModeUI();
            }
        });
    
        // Gestion du déplacement de la grille en mode "grab"
        let isGrabbing = false;
        let startX, startY, scrollLeft, scrollTop;
    
        mapContainer.addEventListener('mousedown', (e) => {
            if (this.mode === 'grab') {
                isGrabbing = true;
                mapContainer.classList.add('grabbing');
                startX = e.pageX - mapContainer.offsetLeft;
                startY = e.pageY - mapContainer.offsetTop;
                scrollLeft = mapContainer.scrollLeft;
                scrollTop = mapContainer.scrollTop;
                this.updateModeUI();
            } else {
                this.isMouseDown = true; // Interaction standard (non-grab)
                this.updateModeUI();
            }
        });
    
        mapContainer.addEventListener('mouseleave', () => {
            isGrabbing = false;
            mapContainer.classList.remove('grabbing');
            this.isMouseDown = false; // S'assure que la souris n'est plus enfoncée
        });
    
        mapContainer.addEventListener('mouseup', () => {
            isGrabbing = false;
            mapContainer.classList.remove('grabbing');
            this.onMouseUp(); // Gestion de la fin du clic pour l'interaction standard
        });
    
        mapContainer.addEventListener('mousemove', (e) => {
            if (isGrabbing) {
                e.preventDefault();
                const x = e.pageX - mapContainer.offsetLeft;
                const y = e.pageY - mapContainer.offsetTop;
                const walkX = (x - startX) * 1.5; // Multiplicateur pour ajuster la vitesse du déplacement horizontal
                const walkY = (y - startY) * 1.5; // Multiplicateur pour ajuster la vitesse du déplacement vertical
                mapContainer.scrollLeft = scrollLeft - walkX;
                mapContainer.scrollTop = scrollTop - walkY;
            } else if (this.isMouseDown) {
                // Interaction standard pendant un clic maintenu
                const hoveredCell = document.elementFromPoint(e.clientX, e.clientY);
                if (hoveredCell && hoveredCell.classList.contains('cell')) {
                    const cell = this.getCellFromElement(hoveredCell);
                    this.onMouseOver(cell, hoveredCell); // Appelle la fonction pour gérer le survol
                }
            }
        });
    
        // Écouteurs pour les boutons de layers (éléments, objets, personnages)
        const toggleLayerElementModeButton = document.getElementById("toggle-layerElement-mode-button");
        const toggleLayerObjectModeButton = document.getElementById("toggle-layerObject-mode-button");
        const toggleLayerCharacterModeButton = document.getElementById("toggle-layerCharacter-mode-button");
    
        toggleLayerElementModeButton.addEventListener('click', () => {
            this.changeLayer('element');
            this.selectedItem = null;
            this.updateModeUI();
        });
    
        toggleLayerObjectModeButton.addEventListener('click', () => {
            this.changeLayer('object');
            this.updateModeUI();
        });
    
        toggleLayerCharacterModeButton.addEventListener('click', () => {
            this.changeLayer('character');
            this.updateModeUI();
        });
    
        // Ajout d'un écouteur global pour capturer les événements de relâchement de souris
        document.addEventListener('mouseup', () => this.onMouseUp());
    }

    getCellFromElement(cellElement) {
        const posX = parseInt(cellElement.style.left) / this.roomData.cell_size;
        const posY = parseInt(cellElement.style.top) / this.roomData.cell_size;
        const currentLayerCells = this.getLayerCells();
    
        return currentLayerCells.find(cell => cell.posX === posX && cell.posY === posY);
    }
    
    

    // Fonction pour changer le mode et mettre à jour l'interface
    changeMode(newMode) {
        this.mode = newMode;
        console.log("Mode changé en :", this.mode);
       
        this.layer = null;
        this.updateLayerButtons(); // Met à jour l'état des boutons de layer dans l'UI
        this.updateLayerInteractivity(); // Met à jour la visibilité et l'interactivité des layers
        this.renderItemList(); // Réaffiche la liste des items filtrés selon le layer
        this.updateModeUI(); // Met à jour l'UI avec le nouveau mode et layer
        this.updateModeButtons();
    
       
    }

    getLayerCells() {
        switch (this.layer) {
        case 'element':
            return this.layerElements;
        case 'object':
            return this.layerObjects;
        case 'character':
            return this.layerCharacters;
        default:
            return [];
        }
    }

    // Met à jour l'apparence des boutons de mode en fonction du mode actif
    updateModeButtons() {
        const playButton = document.getElementById("toggle-play-mode-button");
        const insertButton = document.getElementById("toggle-insert-mode-button");
        const deleteButton = document.getElementById("toggle-delete-mode-button");
        const selectButton = document.getElementById("toggle-select-mode-button");

        playButton.classList.toggle('active-mode', this.mode === 'play');
        insertButton.classList.toggle('active-mode', this.mode === 'insert');
        deleteButton.classList.toggle('active-mode', this.mode === 'delete');
        selectButton.classList.toggle('active-mode', this.mode === 'select');
        // Ajout d'une classe pour le mode grab si nécessaire
    }

    // Met à jour l'affichage de l'interface utilisateur pour indiquer le mode actif
    updateModeUI() {
        const banner = document.getElementById('mode-banner');
        const body = document.querySelector('body');
    
        body.classList.remove('mode-insert', 'mode-delete', 'mode-select', 'mode-grab', 'mode-play'); // Supprime les classes de mode précédentes.
    
        let itemText = this.selectedItem ? ` - ${this.selectedItem.name}` : ''; // Vérifie si un item est sélectionné
        let bannerText = '';
        console.log("Mode update en :", this.mode);
        switch (this.mode) {
        case 'play':
            bannerText = `Jouer - ${this.layer}`;
            banner.className = "banner banner-play";
            body.classList.add('mode-play');
            break;
        case 'insert':
            bannerText = `Insertion - ${this.layer}${itemText}`;
            banner.className = "banner banner-insert";
            body.classList.add('mode-insert');
            break;
        case 'delete':
            bannerText = `Suppression - ${this.layer}`;
            banner.className = "banner banner-delete";
            body.classList.add('mode-delete');
            break;
        case 'select':
            bannerText = `Sélection - ${this.layer}${itemText}`;
            banner.className = "banner banner-select";
            body.classList.add('mode-select');
            break;
        case 'grab':
            bannerText = `Grab - ${this.layer}`;
            banner.className = "banner banner-grab";
            body.classList.add('mode-grab');
            break;
        default:
            bannerText = `Sélection - ${this.layer}`;
            banner.className = "banner banner-select";
            body.classList.add('mode-select');
            break;
        }
    
        banner.textContent = bannerText;
    }
    

    changeLayer(newLayer) {
        // Si on clique à nouveau sur le même layer, on désactive ce layer pour afficher tous les items
        if (this.layer === newLayer) {
            this.layer = null; // Désactivation du layer actif
        } else {
            this.layer = newLayer; // Activation du nouveau layer
        }
    
        // Réinitialise l'item sélectionné à null à chaque changement de layer
        this.selectedItem = null;
        
        this.updateLayerButtons(); // Met à jour l'état des boutons de layer dans l'UI
        this.updateLayerInteractivity(); // Met à jour la visibilité et l'interactivité des layers
        this.renderItemList(); // Réaffiche la liste des items filtrés selon le layer
        this.updateModeUI(); // Met à jour l'UI avec le nouveau mode et layer
    }
    
    
    // Fonction pour mettre à jour l'interactivité des layers
    updateLayerInteractivity() {
        const elementsLayer = document.getElementById('map-container-elements');
        const objectsLayer = document.getElementById('map-container-objects');
        const charactersLayer = document.getElementById('map-container-characters');

        // Désactive les pointer-events pour les couches qui ne sont pas actives
        elementsLayer.classList.remove('layer-active', 'layer-inactive');
        objectsLayer.classList.remove('layer-active', 'layer-inactive');
        charactersLayer.classList.remove('layer-active', 'layer-inactive');

        // Applique les bonnes classes selon le layer actif
        switch (this.layer) {
        case 'element':
            elementsLayer.classList.add('layer-active');
            objectsLayer.classList.add('layer-inactive');
            charactersLayer.classList.add('layer-inactive');
            break;
        case 'object':
            elementsLayer.classList.add('layer-inactive');
            objectsLayer.classList.add('layer-active');
            charactersLayer.classList.add('layer-inactive');
            break;
        case 'character':
            elementsLayer.classList.add('layer-inactive');
            objectsLayer.classList.add('layer-inactive');
            charactersLayer.classList.add('layer-active');
            break;
        case null:
            elementsLayer.classList.remove('layer-inactive');
            objectsLayer.classList.remove('layer-inactive');
            charactersLayer.classList.remove('layer-inactive');
            break;
        default:
            break;
        }
    }

    updateLayerButtons() {
        const toggleLayerElementModeButton = document.getElementById("toggle-layerElement-mode-button");
        const toggleLayerObjectModeButton = document.getElementById("toggle-layerObject-mode-button");
        const toggleLayerCharacterModeButton = document.getElementById("toggle-layerCharacter-mode-button");

        toggleLayerElementModeButton.classList.toggle('active-mode', this.layer === 'element');
        toggleLayerObjectModeButton.classList.toggle('active-mode', this.layer === 'object');
        toggleLayerCharacterModeButton.classList.toggle('active-mode', this.layer === 'character');
        
    }
    

}



