console.log("GameEngine.js");


// Modèle responsable de la gestion des items dans la pièce.
// Utilisé par RoomBuilder pour initialiser les items et par GameEngine pour gérer les interactions avec eux.
// ItemManager qui gère les items dans le contexte de votre jeu. Cette classe sera responsable de la gestion des items, y compris leur création, suppression, association avec des cellules, et leur affichage dans l'interface utilisateur.

// Gestion des Items : Créer, mettre à jour, supprimer des items dans la base de données.
// Association avec les Cellules : Associer des items à des cellules spécifiques dans une pièce.
// Affichage et Interactions : Gérer l'affichage des items sur la carte et les interactions avec l'utilisateur (comme le clic sur un item pour obtenir des détails ou déclencher une action).

// ItemManager peut être utilisé conjointement avec RoomBuilder pour gérer les items au sein des cellules de la pièce. Par exemple, lors de la génération de la pièce avec RoomBuilder, utiliser ItemManager pour placer et gérer les items dans les cellules.

// constructor(itemsData) : initialise la classe avec les données des items provenant de la base de données.

// initializeItems() : Cette méthode initialise les items à partir des données fournies, les structurant dans un format utilisable par la classe.

// associateItemToCell(itemId, posX, posY) : Associe un item spécifique à une cellule dans la carte, en définissant sa position.

// renderItemInCell(cellElement, itemId) : Affiche un item dans une cellule spécifique en utilisant son ID. Un événement est ajouté pour gérer les clics sur l'item.

// onItemClick(item) : Cette méthode est déclenchée lorsqu'un item est cliqué, permettant d'afficher des détails ou de déclencher une action spécifique.

// addItem(itemData) : Permet d'ajouter un nouvel item à la collection.

// removeItem(itemId) : Supprime un item de la collection.

// updateItem(itemId, updatedData) : Met à jour les informations d'un item spécifique.

// Exemple de données d'items provenant de la base de données
// const itemsData = [
//     { id: 1, name: "Sword", description: "A sharp blade", img: "/images/sword.png", effect: "damage", life: 10, value: 100, context: "combat" },
//     { id: 2, name: "Potion", description: "Heals 50 HP", img: "/images/potion.png", effect: "heal", life: 0, value: 50, context: "heal" },
//     // ... autres items
// ];

// Initialisation de l'ItemManager
// const itemManager = new ItemManager(itemsData);
// itemManager.initializeItems();

// Associer un item à une cellule
// itemManager.associateItemToCell(1, 3, 4);

// Afficher l'item dans une cellule spécifique (en supposant que `cellElement` soit l'élément DOM de la cellule)
// itemManager.renderItemInCell(cellElement, 1);

// ItemManager est conçue pour centraliser la gestion des items dans le jeu, y compris leur création, association avec des cellules, et gestion des interactions utilisateur. Elle permet de séparer les préoccupations liées aux items de celles liées à la génération et à la gestion des pièces


export class ItemManager {
    constructor(itemsData) {
        this.itemsData = itemsData; // Données des items provenant de la base de données
        this.items = []; // Collection des items gérés
    }

    // Méthode pour initialiser les items à partir des données
    initializeItems() {
        this.items = this.itemsData.map(item => {
            return {
                id: item.id,
                name: item.name,
                description: item.description,
                img: item.img,
                effect: item.effect,
                life: item.life,
                value: item.value,
                context: item.context,
                position: { x: null, y: null } // La position sera définie lorsqu'ils sont placés sur la carte
            };
        });
    }

    // Méthode pour associer un item à une cellule spécifique
    associateItemToCell(itemId, posX, posY) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            item.position = { x: posX, y: posY };
        } else {
            console.error(`Item avec ID ${itemId} non trouvé.`);
        }
    }

    // Méthode pour afficher un item dans l'interface
    renderItemInCell(cellElement, itemId) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            const itemElement = document.createElement("img");
            itemElement.src = item.img;
            itemElement.alt = item.name;
            itemElement.title = item.description;
            itemElement.style.position = "absolute";
            itemElement.style.width = "100%";
            itemElement.style.height = "100%";
            cellElement.appendChild(itemElement);

            // Ajout d'un événement pour afficher les détails de l'item au clic
            cellElement.addEventListener('click', () => {
                this.onItemClick(item);
            });
        } else {
            console.error(`Item avec ID ${itemId} non trouvé.`);
        }
    }

    // Méthode déclenchée lors du clic sur un item
    onItemClick(item) {
        console.log(`Item cliqué: ${item.name}`);
        console.log(`Description: ${item.description}`);
        console.log(`Effet: ${item.effect}`);
        // Logique supplémentaire pour gérer le clic sur un item (ex: affichage d'un popup, modification des stats du joueur, etc.)
    }

    // Méthode pour ajouter un nouvel item
    addItem(itemData) {
        const newItem = {
            id: this.items.length + 1, // Simple logique d'incrémentation pour l'ID
            ...itemData,
            position: { x: null, y: null } // Pas de position initialement
        };
        this.items.push(newItem);
        console.log(`Nouvel item ajouté: ${newItem.name}`);
    }

    // Méthode pour supprimer un item
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        console.log(`Item avec ID ${itemId} supprimé.`);
    }

    // Méthode pour mettre à jour un item
    updateItem(itemId, updatedData) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            Object.assign(item, updatedData);
            console.log(`Item avec ID ${itemId} mis à jour.`);
        } else {
            console.error(`Item avec ID ${itemId} non trouvé.`);
        }
    }
}
