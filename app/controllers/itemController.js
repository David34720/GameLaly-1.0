const { Item } = require('../models');

const itemController = {
    async index(req, res) { //route / (page index)
        
        const items = await Item.findAll();

        const notification = req.session.notification || null;
        req.session.notification = null; 

        res.render('items', { items, notification });
    },
    
    async add(req, res) { // route get items/add
       
        const notification = req.session.notification || null;
        req.session.notification = null; 

        res.render('item', { notification });
    },

    async create(req, res) { // route post items/create
        console.log(req.body); 
        console.log(req.file);  // Pour déboguer et voir les détails du fichier téléchargé
            
        const { name, description, item_type, effect, life, value, context } = req.body;

        // Conversion des valeurs en nombres pour les champs numériques
        const itemTypeInt = parseInt(item_type, 10);
        const effectInt = parseInt(effect, 10);
        const lifeInt = parseInt(life, 10);
        const valueInt = parseInt(value, 10);

        // Vérification des paramètres
        if (!name || !description || !req.file || isNaN(itemTypeInt) || isNaN(effectInt) || isNaN(lifeInt) || isNaN(valueInt) || !context) {
            req.session.notification = {
                message: "Tous les champs sont requis et doivent être valides.",
                level: 'error'
            };
            return res.redirect('/items/add');  // Redirige vers le formulaire d'ajout avec un message d'erreur
        }

        // Créer un nouvel item en utilisant le chemin de l'image téléchargée
        await Item.create({
            name,
            description,
            img: `/img/items/${req.file.filename}`,  // Chemin de l'image stockée
            item_type: itemTypeInt,
            effect: effectInt,
            life: lifeInt,
            value: valueInt,
            context,
            created_at: new Date(),
            updated_at: new Date(),
        });

        req.session.notification = {
            message: `Item ${name} créé avec succès`,
            level: 'success',
        };

        // Redirection vers la liste des items
        res.redirect('/items'); 
        
    },
     
    
    async edit(req, res) {
        const { id } = req.params;        
        console.log('ID reçu pour l\'édition :', id);

        const item = await Item.findByPk(id);

        const notification =  null;

        res.render('itemEdit', { item, notification });
    },

    async update(req, res) {
        console.log(req.body); 
        console.log(req.file);
        const { id } = req.params;
        const { name, description, item_type, effect, life, value, context } = req.body;

        const itemTypeInt = parseInt(item_type, 10);
        const effectInt = parseInt(effect, 10);
        const lifeInt = parseInt(life, 10);
        const valueInt = parseInt(value, 10);

        if (!name || !description || isNaN(itemTypeInt) || isNaN(effectInt) || isNaN(lifeInt) || isNaN(valueInt) || !context) {
            req.session.notification = {
                message: "Tous les champs sont requis et doivent être valides.",
                level: 'error'
            };
            console.log("Tous les champs sont requis et doivent être valides.", req.body.name)
            return res.redirect(`/items/edit/${id}`);
        }

        const item = await Item.findByPk(id);

        if (!item) {
            req.session.notification = {
                message: 'Item non trouvé',
                level: 'error'
            };
            return res.redirect('/items');
        }

        // Si un fichier est uploadé, on met à jour l'image
        let imgPath = item.img;
        if (req.file) {
            imgPath = `/img/items/${req.file.filename}`;
        }

        await item.update({
            name,
            description,
            img: imgPath,
            item_type: itemTypeInt,
            effect: effectInt,
            life: lifeInt,
            value: valueInt,
            context,
            updated_at: new Date(),
        });

        req.session.notification = {
            message: `Item ${name} mis à jour avec succès`,
            level: 'success',
        };

        res.redirect('/items');
    },
    async destroy(req, res) {
        const { id } = req.params;

        await Item.destroy({ where: { id: id } });
        req.session.notification = {
            message: 'Item supprimé avec succès',
            level: 'success'
        };
        res.redirect('/items');
    },




    
};

module.exports = { itemController };
