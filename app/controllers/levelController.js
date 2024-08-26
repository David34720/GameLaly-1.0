const Level = require('../models/Level');

const levelController = {
    async index(req, res) {
        const levels = await Level.findAll();

        const notification = req.session.notification || null;
        req.session.notification = null;

        res.render('levels', { levels, notification });
    },


    async edit(req, res) {
        const { id } = req.params;

        const level = await Level.findByPk(id);
        const notification =  null;
        res.render('levelEdit', { level, notification });
    },

    async update(req, res) {
        // ! On devrait valider name, on ne sert jamais d'une donnée qui vient d'un client sans la valider
        const { name } = req.body;
        const { id } = req.params;
        req.session.notification = {
            message: 'Niveau modifié avec succès',
            level: 'success'
        };
        await Level.update({ name: name }, { where: { id: id } });

        res.redirect('/levels');
    },

    async create(req, res) {
        // ! On devrait valider name, on ne sert jamais d'une donnée qui vient d'un client sans la valider
        const { name } = req.body;

        await Level.create({ name });

        res.redirect('/levels');
    },

    async destroy(req, res) {
        const { id } = req.params;

        await Level.destroy({ where: { id: id } });
        req.session.notification = {
            message: 'Niveau supprimée avec succès',
            level: 'success'
        };
        res.redirect('/levels');
    },
};

module.exports = { levelController };
