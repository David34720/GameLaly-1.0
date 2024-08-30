console.log("roomBuilder");
console.log("Room:", room);console.log("Cells:", cells);

class RoomBuilder {
    constructor(room, cells) {
        this.room = room;
        this.cells = cells; // Les cellules existantes dans la base de données
        this.generatedCells = [];
    }

    initMap() {
        console.log("roomBuilder initMap");
        this.createCells();
        this.renderMap();
    }

    createCells() {
        const { nb_rows, nb_cols, cell_size } = this.room;
        for (let y = 0; y < nb_rows; y++) {
            for (let x = 0; x < nb_cols; x++) {
                const existingCell = this.cells.find(cell => cell.pos_x === x && cell.pos_y === y);
                this.generatedCells.push({
                    x: x * cell_size,
                    y: y * cell_size,
                    posX: x,
                    posY: y,
                    exists: !!existingCell // Marquer si la cellule existe déjà ou non
                });
            }
        }
        console.log("Cells created:", this.generatedCells);
    }

    renderMap() {
        const mapContainer = document.getElementById("map-container");
        mapContainer.innerHTML = ""; // Vider le conteneur
    
        // Définir les propriétés de la grille CSS
        mapContainer.style.display = "grid";
        mapContainer.style.gridTemplateColumns = `repeat(${this.room.nb_cols}, ${this.room.cell_size}px)`;
        mapContainer.style.gridTemplateRows = `repeat(${this.room.nb_rows}, ${this.room.cell_size}px)`;
    
        this.generatedCells.forEach(cell => {
            const cellElement = document.createElement("div");
            cellElement.style.width = `${this.room.cell_size}px`;
            cellElement.style.height = `${this.room.cell_size}px`;
            cellElement.style.boxSizing = "border-box";
            cellElement.style.border = "1px solid #ccc";
    
            if (cell.exists) {
                cellElement.style.backgroundColor = "#007bff"; // Couleur des cellules existantes
            } else {
                cellElement.style.backgroundColor = "#fff"; // Couleur des cases vides
            }
    
            mapContainer.appendChild(cellElement);
        });
    }
    
}
const roomBuilder = new RoomBuilder(room, cells);
console.log('function :',typeof RoomBuilder);
roomBuilder.initMap();
console.log("Room:", room);console.log("Cells:", cells);
