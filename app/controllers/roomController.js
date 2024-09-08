const { Room, Cell, Item, User, Level, Message } = require('../models');
const { sequelizeConnection } = require('../db/sequelize');

const roomController = {
    async index(req, res) {
        const rooms = await Room.findAll();
        const notification = req.session.notification || null;
        req.session.notification = null;
        res.render('rooms', { rooms, notification });
    },

    async add(req, res) {
        const { map_id } = req.params;
        let isFirst = true;
        const qtyRoomWithMapId = await Room.count({ where: { map_id: map_id } });
        if (qtyRoomWithMapId > 0) {
            isFirst = false;
        }
        const room = await Room.create({
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
        const user = await User.findByPk(req.session.user.id);
        const playerData = {
            pos_x: room.start_x,
            pos_y: room.start_y,
            img: user ? user.img : 'default-image.png'
        };
        const itemsData = await Item.findAll();

        const notification = req.session.notification || null;
        req.session.notification = null;
        res.render(`rooms`, { room, notification, playerData, cells: [], itemsData });
    },
    

    async create(req, res) {
        req.session.notification = {
            message: 'Carte créée avec succès',
            level: 'success'
        };
        await Map.create({
            name: req.body.name,
            description: req.body.description,
            users_id: 1,
            level_id: 1
        });
        res.redirect('/map/add');
    },

    async edit(req, res) {
        const { id } = req.params;
        const itemsData = await Item.findAll();
        const room = await Room.findByPk(id, {
            include: [{ model: Cell, as: 'cells' }]
        });

        if (!room) {
            req.session.notification = {
                message: 'Room not found',
                level: 'danger',
            };
            return res.redirect('/rooms');
        }

        const user = await User.findByPk(req.session.user.id);
        const playerData = {
            pos_x: room.start_x,
            pos_y: room.start_y,
            img: user ? user.img : 'default-image.png'
        };
        console.log('playerData', playerData);

        const cells = room.cells;
        const notification = null;
        res.render('rooms', { itemsData, room, cells, notification, playerData });
    },

    async update(req, res) {
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

        await Room.update({
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
            await Cell.destroy({ where: { room_id_link: id }, transaction });
            await Cell.destroy({ where: { room_id: id }, transaction });
            await Room.destroy({ where: { id: id }, transaction });
            await transaction.commit();

            req.session.notification = {
                message: 'Room supprimée avec succès',
                level: 'success'
            };
        } catch (error) {
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
        const { name } = req.body;
        await Level.create({ name: name });
        res.redirect('/levels');
    },

    async saveCells(req, res) {
        const cellsData = req.body;
        console.log('saveCellControler', cellsData);
        if (!Array.isArray(cellsData)) {
            return res.status(400).json({ error: 'Les données envoyées doivent être un tableau.' });
        }

        try {
            for (let cellData of cellsData) {
                // Suppression des cellules existantes avant d'insérer les nouvelles
                await Cell.destroy({
                    where: {
                        room_id: cellData.room_id,
                        layer_type: cellData.layer_type,
                        pos_x: cellData.pos_x,
                        pos_y: cellData.pos_y,
                    }
                });

                // Insertion des nouvelles cellules avec gestion des objets plus grands (width, height)
                await Cell.create({
                    room_id: cellData.room_id,
                    layer_type: cellData.layer_type,
                    pos_x: cellData.pos_x,
                    pos_y: cellData.pos_y,
                    item_id: cellData.item_id,
                    width: cellData.width || 1,  // Largeur par défaut à 1
                    height: cellData.height || 1,  // Hauteur par défaut à 1
                    offset_x: cellData.offset_x || 0,
                    offset_y: cellData.offset_y || 0
                });
            }

            res.status(200).json({ message: 'Cellules sauvegardées avec succès' });
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des cellules:', error);
            res.status(500).json({ error: 'Erreur lors de la sauvegarde des cellules.' });
        }
    },

    // Méthode pour mettre à jour une cellule, incluant la gestion de la largeur et de la hauteur
    async updateCell(req, res) {
        try {
            console.log('Update cell data received:', req.body);
    
            const { cell_id, layer_type, pos_x, pos_y, item_id,  width, height, offset_x, offset_y } = req.body;
    
            const cell = await Cell.findOne({
                where: { id: cell_id }
            });
    
            if (!cell) {
                return res.status(404).json({ error: 'Cellule non trouvée' });
            }
    
    
            await cell.update({
                item_id: item_id || null,
                width: width || 1,
                height: height || 1,
                layer_type: layer_type || 'element',
                pos_x: pos_x || 0,
                pos_y: pos_y || 0,
                offset_x: offset_x || 0,
                offset_y: offset_y || 0
            });
    
            res.status(200).json({ message: 'Cellule mise à jour avec succès' });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la cellule:', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour de la cellule.' });
        }
    },

    async getMessagesForRoom(req, res) {
        const { room_id } = req.params;
        try {
            const messagesWithCellIds = await Message.findAll({
                include: [{
                    model: Cell,
                    as: 'cell',
                    where: {
                        room_id: room_id // Filtrer par room_id dans les cellules associées
                    },
                    attributes: ['id'] // Ne récupérer que l'ID de la cellule
                }]
            });
    
            if (!messagesWithCellIds.length) {
                return res.status(200).json([]); // Retourner un tableau vide si aucun message n'est trouvé
            }
    
            return res.status(200).json(messagesWithCellIds); // Si des messages sont trouvés, les retourner
        } catch (error) {
            console.error('Erreur lors de la récupération des messages pour la salle:', error);
            return res.status(500).json({ error: 'Erreur serveur lors de la récupération des messages' });
        }
    },
    
    

    async getMessageForCell(req, res) {
        const { cell_id } = req.params;
    
        try {
            // Cherche la cellule avec le message associé
            const cellWithMessage = await Cell.findOne({
                where: { id: cell_id },
                include: [{
                    model: Message,
                    as: 'message',  // S'assurer que l'alias est correct
                    attributes: ['id', 'text', 'created_at', 'updated_at']  // Sélectionner les attributs pertinents du message
                }]
            });
    
            // Si la cellule ou le message n'existe pas, retourner un message vide
            if (!cellWithMessage || !cellWithMessage.message) {
                return res.status(200).json({ text: '' });  // Retourne un objet avec un texte vide
            }
    
            res.status(200).json(cellWithMessage.message);  // Retourne le message s'il existe
        } catch (error) {
            console.error('Erreur lors de la récupération du message pour la cellule :', error);
            res.status(500).json({ error: 'Erreur serveur lors de la récupération du message' });
        }
    },
    
    
    
    async updateCellMessage(req, res) {
        try {
            const { cell_id, messageContent } = req.body;
    
            // Vérification des données nécessaires
            if (!cell_id || typeof messageContent !== 'string') {
                return res.status(400).json({ error: 'cell_id et messageContent sont requis et valides.' });
            }
    
            // Récupération de la cellule
            const cell = await Cell.findByPk(cell_id);
    
            if (!cell) {
                return res.status(404).json({ error: 'Cellule non trouvée.' });
            }
    
            // Si la cellule a un message, on le met à jour, sinon on en crée un
            if (cell.message_id) {
                const message = await Message.findByPk(cell.message_id);
                if (message) {
                    await message.update({ text: messageContent });
                    console.log('Message mis à jour:', message);
                    res.status(200).json({ message: 'Message mis à jour avec succès', messageData: message });
                } else {
                    return res.status(404).json({ error: 'Message non trouvé.' });
                }
            } else {
                // Création d'un nouveau message et association à la cellule
                const newMessage = await Message.create({ text: messageContent });
                await cell.update({ message_id: newMessage.id });
                console.log('Nouveau message créé:', newMessage);
                res.status(200).json({ message: 'Message créé et associé à la cellule avec succès', messageData: newMessage });
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du message:', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour du message.' });
        }
    },
    
    
    async deleteCells(req, res) {
        const cellsData = req.body;

        if (!Array.isArray(cellsData)) {
            return res.status(400).json({ error: 'Les données envoyées doivent être un tableau.' });
        }

        try {
            for (let cellData of cellsData) {
                await Cell.destroy({
                    where: {
                        room_id: cellData.room_id,
                        pos_x: cellData.pos_x,
                        pos_y: cellData.pos_y
                    }
                });
            }

            res.status(200).json({ message: 'Cellules supprimées avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression des cellules:', error);
            res.status(500).json({ error: 'Erreur lors de la suppression des cellules.' });
        }
    },

    async updateUserImg(req, res) {
        const { img } = req.body;
        const userId = req.session.user.id;
        await User.update({ img: img }, { where: { id: userId } });
        res.json({ success: true });
    },

    async getCharacterSelection(req, res) {
        const characters = await Item.findAll({ where: { item_type: 9 } });
        res.json({ success: true, characters });
    }
};

module.exports = { roomController };
