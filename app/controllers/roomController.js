const { Room, Cell, Item } = require('../models');

const { sequelizeConnection } = require('../db/sequelize');
const roomController = {
    async index(req, res) { //route / (page index)
        
        const rooms = await Room.findAll();
      
        const notification = req.session.notification || null;
        req.session.notification = null; 

        res.render('rooms', { rooms, notification });
    },
    
    async add(req, res) { // route get map/add
        const { map_id } = req.params;

        console.log("route rooms/add", map_id);
        let isFirst = true;
        const qtyRoomWithMapId = await Room.count({ where: { map_id: map_id } });
        if (qtyRoomWithMapId > 0) {
            isFirst = false;
        }
        const room = await Room.create({ // route get/rooms/add/:map_id(\\d+)
            name: "Nouvelle pièce",
            description: "Description de la nouvelle carte",
            map_id: map_id,
            first_room: isFirst,
            cell_size: 30,
            nb_rows: 10,
            nb_cols: 10,
            start_x: 0,
            start_y: 0,
            img_bg: "",
            color_bg: "#FFFFFF"
        });

        const notification = req.session.notification || null;
        req.session.notification = null; 
        
        res.render(`rooms`, { room, notification });
    },
    async create(req, res) { // route post map/create
        
        req.session.notification = {
            message: 'Carte créée avec succès',
            level: 'success'
        };
        await Map.create({ 
            name: req.body.name, 
            description: req.body.description, 
            users_id: 1, 
            level_id: 1}
        );
    

        res.redirect('/map/add');
    },

    async edit(req, res) {

        const { id } = req.params;

        const itemsData = await Item.findAll();
        
        
        
        const room = await Room.findByPk(id, {
            include: [{ model: Cell, as: 'cells' }] // Spécifiez l'alias correct ici
        });

        if (!room) {
            req.session.notification = {
                message: 'Room not found',
                level: 'danger',
            };
            return res.redirect('/rooms');
        }

        const cells = room.cells;
        const notification = null;

        res.render('rooms', { itemsData, room, cells, notification });
    },

    async update(req, res) {
        // Valider et extraire les champs du corps de la requête
        const { 
            name, 
            description,
            map_id,
            first_room,
            cell_size,
            nb_rows,
            nb_cols,  
            start_x,
            start_y,
            img_bg,
            color_bg
        } = req.body;
    
        const { id } = req.params;
    
        req.session.notification = {
            message: 'Room modifiée avec succès',
            level: 'success'
        };
    
        // Mise à jour de la room
        const updatedRoom = await Room.update({ 
            name, 
            description, 
            map_id,
            first_room,
            cell_size,
            nb_rows,
            nb_cols,  
            start_x,
            start_y,
            img_bg,
            color_bg,
            updated_at: new Date()             
        }, { 
            where: { id }
        });
    
        console.log("Updated Room : ", updatedRoom[0]);
        res.redirect('/rooms/edit/' + id);
    },

    async duplicate(req, res) {
        const { id } = req.params;
        const room = await Room.findByPk(id);

        const newRoom = await Room.create({ 
            name: room.name + " - Copie",
            description: room.description,
            map_id: room.map_id,
            first_room: false,
            cell_size: room.cell_size,
            nb_rows: room.nb_rows,
            nb_cols: room.nb_cols,
            start_x: room.start_x,
            start_y: room.start_y,
            img_bg: room.img_bg,
            color_bg: room.color_bg
        });
        res.redirect('/rooms/edit/' + newRoom.id);
    },

    async destroy(req, res) {
        const { id } = req.params;
    
        const transaction = await sequelizeConnection().transaction();
    
        try {
            // 1. Supprimer toutes les cellules où room_id_link pointe vers la Room à supprimer
            await Cell.destroy({ where: { room_id_link: id }, transaction });
    
            // 2. Supprimer toutes les cellules liées à la Room via room_id
            await Cell.destroy({ where: { room_id: id }, transaction });
    
            // 3. Supprimer la Room elle-même
            await Room.destroy({ where: { id: id }, transaction });
    
            // 4. Valider la transaction
            await transaction.commit();
    
            req.session.notification = {
                message: 'Room supprimée avec succès',
                level: 'success'
            };
        } catch (error) {
            // 5. Annuler la transaction en cas d'erreur
            await transaction.rollback();
            console.error('Failed to delete room:', error);
            req.session.notification = {
                message: 'Erreur lors de la suppression de la Room',
                level: 'danger'
            };
        }
    
        res.redirect('/map/add');
    },
    



    async store(req, res) {
        // ! On devrait valider name, on ne sert jamais d'une donnée qui vient d'un client sans la valider
        const { name } = req.body;

        await Level.create({ name: name });

        res.redirect('/levels');
    },

    async saveCells(req, res) {
        const cellsData = req.body;
        
        console.log('Données reçues par le serveur:', cellsData); // Ajoutez ce log
        
        if (!Array.isArray(cellsData)) {
            return res.status(400).json({ error: 'Les données envoyées doivent être un tableau.' });
        }
    
        try {
            // Suppression des cellules existantes et insertion des nouvelles
            for (let cellData of cellsData) {
                await Cell.destroy({
                    where: {
                        room_id: cellData.room_id,
                        pos_x: cellData.pos_x,
                        pos_y: cellData.pos_y
                    }
                });
                
                await Cell.create(cellData);
            }
    
            res.status(200).json({ message: 'Cellules sauvegardées avec succès' });
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des cellules:', error);
            res.status(500).json({ error: 'Erreur lors de la sauvegarde des cellules.' });
        }
    }
    
    
};

module.exports = { roomController };
