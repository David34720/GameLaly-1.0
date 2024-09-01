// Classe RoomBuilder pour générer et gérer l'affichage d'une pièce avec des cellules interactives.
export class RoomBuilder {
    // Constructeur pour initialiser l'instance de RoomBuilder avec les données de la pièce (roomData) et la liste des items (items).
    constructor(roomData, items) {
        this.roomData = roomData; // Données sur la pièce, incluant le nombre de lignes, colonnes, etc.
        this.items = items; // Liste des items disponibles pour être placés dans les cellules
        this.cells = []; // Tableau pour stocker les cellules de la pièce
        this.selectedItem = null; // Item actuellement sélectionné pour insertion dans une cellule
        this.mode = 'select'; // Mode courant : 'select', 'insert', ou 'delete'
        this.selectedCells = new Set(); // Ensemble des cellules sélectionnées
        this.isMouseDown = false; // Indicateur pour savoir si la souris est enfoncée
        this.isSaving = false; // Indicateur pour empêcher les sauvegardes répétées
        this.previousMode = null; // stocker le mode précédent pour toggle touch shift et revenir en arrière au keyup
        this.playerPosition = { x: 0, y: 0 }; // Position du joueur (x, y) en pixels
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
        this.updateModeUI(); // Met à jour l'affichage de l'interface utilisateur selon le mode actif.
        this.initPlayerPosition(); // Initialise la position du joueur
        
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


    // Crée les cellules de la carte en fonction des données de la pièce (roomData) fournies lors de l'instanciation.
    // Les cellules sont initialisées avec leur position, leur taille, et les éventuels items ou messages.
    createCells() {
        const { nb_rows, nb_cols, cell_size } = this.roomData; // Récupère les dimensions et la taille des cellules depuis roomData.
        for (let y = 0; y < nb_rows; y++) {
            for (let x = 0; x < nb_cols; x++) {
                const cell = {
                    x: x * cell_size, // Position en pixels sur l'axe X
                    y: y * cell_size, // Position en pixels sur l'axe Y
                    posX: x, // Position en colonnes
                    posY: y, // Position en lignes
                    exists: false, // Indique si la cellule contient un item ou un message
                    item: null, // ID de l'item dans la cellule (null si aucun)
                    message: null // ID du message dans la cellule (null si aucun)
                };
                const existingCell = this.roomData.cells.find(c => c.pos_x === x && c.pos_y === y); // Vérifie si une cellule existe déjà à cette position.
                if (existingCell) {
                    cell.exists = true; // Marque la cellule comme existante.
                    cell.item = existingCell.item_id; // Associe l'item existant à la cellule.
                    cell.message = existingCell.message_id; // Associe le message existant à la cellule.
                }
                this.cells.push(cell); // Ajoute la cellule au tableau des cellules.
            }
        }
    }

    // Affiche la carte en créant les éléments HTML pour chaque cellule et en les positionnant dans le conteneur principal.
    // Les cellules existantes sont affichées avec une couleur spécifique et peuvent contenir un item.
    renderMap() {
        const mapContainer = document.getElementById("map-container");
        mapContainer.innerHTML = ""; // Vide le conteneur pour le réinitialiser.

        mapContainer.style.display = "grid";
        mapContainer.style.gridTemplateColumns = `repeat(${this.roomData.nb_cols}, ${this.roomData.cell_size}px)`; // Définit le nombre de colonnes et la taille des cellules.
        mapContainer.style.gridTemplateRows = `repeat(${this.roomData.nb_rows}, ${this.roomData.cell_size}px)`; // Définit le nombre de lignes et la taille des cellules.

        this.cells.forEach(cell => {
            const cellElement = document.createElement("div"); // Crée un élément HTML pour chaque cellule.
            cellElement.className = "cell"; // Ajoute la classe CSS pour le style de la cellule.
            cellElement.style.width = `${this.roomData.cell_size}px`; // Définit la largeur de la cellule.
            cellElement.style.height = `${this.roomData.cell_size}px`; // Définit la hauteur de la cellule.
            cellElement.style.boxSizing = "border-box"; // Assure que le padding et la bordure sont inclus dans la taille totale.
            cellElement.style.border = "1px solid #ccc"; // Ajoute une bordure aux cellules.

            if (cell.exists) {
                cellElement.style.backgroundColor = "#007bff"; // Change la couleur de fond pour les cellules existantes.
                if (cell.item) {
                    this.renderItemInCell(cellElement, cell.item); // Affiche l'item dans la cellule si elle en contient un.
                }
            } else {
                cellElement.style.backgroundColor = "#fff"; // Couleur de fond pour les cellules vides.
            }

            mapContainer.appendChild(cellElement); // Ajoute l'élément cellule au conteneur.

            // Ajoute des événements pour gérer les interactions utilisateur (clics et survol).
            cellElement.addEventListener('mousedown', () => this.onMouseDown(cell, cellElement));
            cellElement.addEventListener('mouseover', () => this.onMouseOver(cell, cellElement));
        });

        document.addEventListener('mouseup', () => this.onMouseUp()); // Ajoute un événement global pour gérer la fin du clic.
    }

    // Gère le clic initial sur une cellule, en fonction du mode courant (sélection, insertion, suppression).
    onMouseDown(cell, cellElement) {
        this.isMouseDown = true; // Marque le début d'une interaction par clic.
        this.handleCellInteraction(cell, cellElement); // Gère l'interaction avec la cellule en fonction du mode.
        cellElement.classList.add('hovered'); // Ajoute une classe CSS pour indiquer que la cellule est survolée.
    }

    // Gère le survol d'une cellule lors du clic maintenu, en fonction du mode courant.
    onMouseOver(cell, cellElement) {
        if (!this.isMouseDown) return; // Ne rien faire si la souris n'est pas enfoncée.
        this.handleCellInteraction(cell, cellElement); // Gère l'interaction avec la cellule en fonction du mode.
        cellElement.classList.add('hovered'); // Ajoute une classe CSS pour indiquer que la cellule est survolée.
    }

    // Gère la fin du clic en réinitialisant les états et en déclenchant la sauvegarde des cellules sélectionnées.
    onMouseUp() {
        this.isMouseDown = false; // Marque la fin de l'interaction par clic.
        this.clearHoveredCells(); // Supprime les styles des cellules survolées.
        this.saveSelectedCells(); // Sauvegarde les cellules sélectionnées dans la base de données.
    }

    // Supprime les styles des cellules survolées pour réinitialiser leur apparence.
    clearHoveredCells() {
        const hoveredCells = document.querySelectorAll('.cell.hovered'); // Sélectionne toutes les cellules survolées.
        hoveredCells.forEach(cell => cell.classList.remove('hovered')); // Supprime la classe CSS indiquant le survol.
    }

    // Gère l'interaction avec une cellule en fonction du mode sélectionné (sélection, insertion, suppression).
    handleCellInteraction(cell, cellElement) {
        const cellKey = `${cell.posX}-${cell.posY}`; // Clé unique pour identifier chaque cellule.

        if (this.mode === 'select') {
            this.selectCell(cell); // Sélectionne la cellule pour afficher ses détails.
            return;
        }

        if (this.mode === 'insert' && this.selectedItem) {
            this.placeItemInCell(cell, this.selectedItem.id); // Insère un item dans la cellule.
            this.selectedCells.add(cellKey); // Ajoute la cellule sélectionnée à l'ensemble des cellules à sauvegarder.
            cellElement.style.backgroundColor = "#007bff"; // Changement de couleur immédiat pour indiquer l'insertion.
        } else if (this.mode === 'delete' && cell.exists) {
            this.deleteCell(cell); // Supprime l'item ou le message de la cellule.
            this.selectedCells.add(cellKey); // Ajoute la cellule sélectionnée à l'ensemble des cellules à sauvegarder.
            cellElement.style.backgroundColor = "#fff"; // Changement de couleur immédiat pour indiquer la suppression.
        }
    }

    // Met à jour l'apparence d'une cellule spécifique après modification (insertion ou suppression d'item).
    updateCellAppearance(cell, isSelected) {
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
            console.warn('Aucune cellule sélectionnée pour la sauvegarde ou sauvegarde déjà en cours.');
            return;
        }

        this.isSaving = true; // Empêche les sauvegardes répétées.

        const cellsData = Array.from(this.selectedCells).map(key => {
            const [posX, posY] = key.split('-').map(Number); // Récupère les coordonnées de la cellule à partir de la clé.
            const cell = this.cells.find(c => c.posX === posX && c.posY === posY); // Trouve la cellule correspondante.

            return {
                room_id: this.roomData.id, // Identifiant de la pièce.
                pos_x: cell.posX, // Coordonnée X de la cellule.
                pos_y: cell.posY, // Coordonnée Y de la cellule.
                item_id: cell.exists ? cell.item : null, // Identifiant de l'item (null si aucun).
                message_id: cell.exists ? cell.message : null // Identifiant du message (null si aucun).
            };
        });

        try {
            const response = await fetch('/rooms/save-cells', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cellsData), // Envoie les données des cellules sélectionnées au serveur.
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erreur lors de la sauvegarde des cellules: ${errorMessage}`);
            }

            console.log('Les cellules ont été sauvegardées avec succès.');
            this.selectedCells.clear(); // Réinitialise l'ensemble des cellules sélectionnées.
            this.updateCellsAfterSave(cellsData); // Met à jour l'état des cellules après la sauvegarde.
            this.renderMap(); // Réaffiche la carte avec les modifications.
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            this.isSaving = false; // Réinitialise l'indicateur de sauvegarde.
        }
    }

    // Met à jour les cellules après la sauvegarde pour refléter les modifications.
    updateCellsAfterSave(cellsData) {
        cellsData.forEach(data => {
            const cell = this.cells.find(c => c.posX === data.pos_x && c.posY === data.pos_y); // Trouve la cellule correspondante.
            if (cell) {
                cell.exists = data.item_id !== null; // Met à jour l'existence de l'item dans la cellule.
                cell.item = data.item_id; // Met à jour l'item dans la cellule.
                cell.message = data.message_id; // Met à jour le message dans la cellule.
            }
        });
    }

    // Sélectionne une cellule et affiche ses détails dans l'interface utilisateur.
    selectCell(cell) {
        console.log(`Sélection de la cellule : (${cell.posX}, ${cell.posY})`);
        this.showCellDetails(cell); // Affiche les détails de la cellule sélectionnée.
        if (cell.exists && cell.item) {
            this.highlightSelectedItem(this.items.find(item => item.id === cell.item)); // Met en évidence l'item sélectionné.
        }
    }

    // Affiche les détails de la cellule sélectionnée dans un conteneur HTML.
    showCellDetails(cell) {
        const detailsContainer = document.getElementById("cell-details");
        detailsContainer.innerHTML = `
            <p>Position: (${cell.posX}, ${cell.posY})</p>
            <p>Item ID: ${cell.item || "Aucun"}</p>
            <p>Message ID: ${cell.message || "Aucun"}</p>
        `;
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
        this.updateCellAppearance(cell, false); // Met à jour l'apparence de la cellule.
    }

    // Affiche un item dans une cellule spécifique en utilisant son élément HTML.
    renderItemInCell(cellElement, itemId) {
        const item = this.items.find(item => item.id === itemId); // Trouve l'item correspondant.
        if (item) {
            const itemElement = document.createElement("img"); // Crée un élément image pour l'item.
            itemElement.src = item.img; // Définit la source de l'image.
            itemElement.alt = item.name; // Définit l'alt pour l'accessibilité.
            itemElement.title = item.description; // Définit le titre pour afficher la description au survol.
            itemElement.style.position = "relative"; // Positionne l'image à l'intérieur de la cellule.
            itemElement.style.width = "100%"; // Définit la largeur de l'image.
            itemElement.style.height = "100%"; // Définit la hauteur de l'image.
            itemElement.draggable = false; // Empêche le glisser-déposer par défaut de l'image.
            cellElement.appendChild(itemElement); // Ajoute l'image de l'item à la cellule.
        } else {
            console.error(`Item avec ID ${itemId} non trouvé.`);
        }
    }

    // Affiche la liste des items disponibles pour être placés dans les cellules.
    renderItemList() {
        const itemListContainer = document.getElementById("item-list");
        itemListContainer.innerHTML = ""; // Vide la liste des items pour la réinitialiser.
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
                this.selectedItem = item; // Définit l'item sélectionné lors du clic.
                console.log(`Item sélectionné: ${item.name}`);
            });

            itemElement.querySelector("img").draggable = false; // Empêche le glisser-déposer de l'image.

            itemListContainer.appendChild(itemElement); // Ajoute l'item à la liste des items disponibles.
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
    
        playModeButton.addEventListener('click', () => {
            this.changeMode('play');
        });

        insertModeButton.addEventListener('click', () => {
            this.changeMode('insert');
        });
    
        deleteModeButton.addEventListener('click', () => {
            this.changeMode('delete');
        });
    
        selectModeButton.addEventListener('click', () => {
            this.changeMode('select');
        });
    
        // Ajout des événements pour la touche Shift
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Shift') {
                if (this.mode !== 'grab') {
                    this.previousMode = this.mode; // Sauvegarde du mode actuel
                    this.changeMode('grab'); // Passe en mode "grab"
                }
            }
        });
    
        document.addEventListener('keyup', (event) => {
            if (event.key === 'Shift' && this.mode === 'grab') {
                this.changeMode(this.previousMode); // Restaure le mode précédent
                this.previousMode = null; // Réinitialise le mode précédent
            }
        });
    
        // Gestion du déplacement de la grille lorsque le mode "grab" est activé
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
            }
        });
    
        mapContainer.addEventListener('mouseleave', () => {
            isGrabbing = false;
            mapContainer.classList.remove('grabbing');
        });
    
        mapContainer.addEventListener('mouseup', () => {
            isGrabbing = false;
            mapContainer.classList.remove('grabbing');
        });
    
        mapContainer.addEventListener('mousemove', (e) => {
            if (!isGrabbing) return;
            e.preventDefault();
            const x = e.pageX - mapContainer.offsetLeft;
            const y = e.pageY - mapContainer.offsetTop;
            const walkX = (x - startX) * 1.5; // Multiplicateur pour la vitesse de défilement horizontal
            const walkY = (y - startY) * 1.5; // Multiplicateur pour la vitesse de défilement vertical
            mapContainer.scrollLeft = scrollLeft - walkX;
            mapContainer.scrollTop = scrollTop - walkY;
        });
    }
    

    // Fonction pour changer le mode et mettre à jour l'interface
    changeMode(newMode) {
        this.mode = newMode;
        this.updateModeButtons();
        this.updateModeUI();
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
    
        body.classList.remove('mode-insert', 'mode-delete', 'mode-select', 'mode-grab'); // Supprime les classes de mode précédentes.
    
        switch (this.mode) {
        case 'play':
            banner.textContent = "Mode Play Activé";
            banner.className = "banner banner-insert";
            body.classList.add('mode-play');
            break;
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
        case 'select':
            banner.textContent = "Mode Sélection Activé";
            banner.className = "banner banner-select";
            body.classList.add('mode-select');
            break;
        case 'grab':
            banner.textContent = "Mode Saisie Activé";
            banner.className = "banner banner-grab";
            body.classList.add('mode-grab');
            break;
        default:
            banner.textContent = "Mode Sélection Activé";
            banner.className = "banner banner-select";
            body.classList.add('mode-select');
            break;
        }
    }
    

}



