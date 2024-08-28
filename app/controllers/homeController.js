const Map = require('../models/Map');

const homeController = {
    async index(req, res) {
     
           
        const maps = await Map.findAll();
        
        const notification = req.session.notification || null;
        req.session.notification = null; 

        res.render('index', { maps, notification });
        
    },
};

module.exports = { homeController };
