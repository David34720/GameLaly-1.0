const { Room, Cell } = require('../models');

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
        const room = await Room.findByPk(id);
        const notification =  null;

        res.render('rooms', { room, notification });
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

    async destroy(req, res) {
        const { id } = req.params;

        const transaction = await sequelizeConnection().transaction();

   
        // Supprimer les Cells liées
        await Cell.destroy({ where: { room_id: id }, transaction });

        // Vérifier la suppression
        const cellsRemaining = await Cell.findAll({ where: { room_id: id } });
        if (cellsRemaining.length > 0) {
            throw new Error('Failed to delete all cells associated with the room');
        }

        // Supprimer la Room
        await Room.destroy({ where: { id: id }, transaction });

        // Valider la transaction
        await transaction.commit();

        req.session.notification = {
            message: 'Room supprimée avec succès',
            level: 'success'
        };

        res.redirect('/map/add');
    },



    async store(req, res) {
        // ! On devrait valider name, on ne sert jamais d'une donnée qui vient d'un client sans la valider
        const { name } = req.body;

        await Level.create({ name: name });

        res.redirect('/levels');
    },

    
};

module.exports = { roomController };
