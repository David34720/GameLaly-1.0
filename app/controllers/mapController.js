const { Map, Room, Cell } = require('../models');


const mapController = {
    async index(req, res) { //route / (page index)
        
        const maps = await Map.findAll();
        
        const notification = req.session.notification || null;
        req.session.notification = null; 

        res.render('maps', { maps, notification });
    },
    
    async add(req, res) { // route get map/add
        
        console.log("route maps/add");
        const maps = await Map.findAll({
            include: {
                model: Room,
                as: 'rooms',
                include: {
                    model: Cell,
                    as: 'cells',
                    include: {
                        model: Room,
                        as: 'linkedRoom',
                    },
                },
            },
        });
        console.log('maps:', JSON.stringify(maps, null, 2))
        const notification = req.session.notification || null;
        req.session.notification = null; 
        
        res.render('maps', { maps, notification });
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

        const map = await Map.findByPk(id);
        const notification =  null;
        res.render('mapEdit', { map, notification });
    },
    async update(req, res) {
        // ! On devrait valider name, on ne sert jamais d'une donnée qui vient d'un client sans la valider
        const { name, description } = req.body;
        const { id } = req.params;
        req.session.notification = {
            message: 'Carte modifiée avec succès',
            level: 'success'
        };
        await Map.update({ name, description, users_id: 1, level_id: 1 }, { where: { id: id } });

        res.redirect('/map/add');
    },
    async destroy(req, res) {
        const { id } = req.params;

        await Map.destroy({ where: { id: id } });
        req.session.notification = {
            message: 'Carte supprimée avec succès',
            level: 'success'
        };
        res.redirect('/map/add');
    },




    
};

module.exports = { mapController };
