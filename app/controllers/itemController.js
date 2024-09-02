const { Item, ItemType } = require('../models');

const itemController = {
    async index(req, res) {
        const { type } = req.query; // Récupère le type depuis les paramètres de la requête
        let filter = {};
        
        if (type) {
            filter = { item_type: type }; // Filtre les items par type
        }

        const items = await Item.findAll({
            where: filter,
            include: {
                model: ItemType,
                as: 'type',
            }
        });

        const types = await ItemType.findAll(); // Récupère tous les types pour le filtre
        const notification = req.session.notification || null;
        req.session.notification = null;

        res.render('items', { items, types, notification, selectedType: type });
    },
    
    async add(req, res) {
        const notification = req.session.notification || null;
        req.session.notification = null;
    
        const types = await ItemType.findAll(); // Récupération de la liste des types d'items
    
        res.render('item', { notification, types }); // Passez les types à la vue
    },

    async create(req, res) { // route post items/create
        console.log(req.body); 
        console.log(req.file);  // Pour déboguer et voir les détails du fichier téléchargé
            
        const { name, description, item_type, effect, life, value, context, is_obstacle } = req.body;

        // Conversion des valeurs en nombres pour les champs numériques
        const itemTypeInt = parseInt(item_type, 10);
        const effectInt = parseInt(effect, 10);
        const lifeInt = parseInt(life, 10);
        const valueInt = parseInt(value, 10);

        // Vérification des paramètres
        if (!name || !description || !req.file || isNaN(itemTypeInt) || isNaN(effectInt) || isNaN(lifeInt) || isNaN(valueInt) || !context || !is_obstacle) {
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
            is_obstacle,
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
        const notification = null;
    
        const types = await ItemType.findAll(); // Récupération de la liste des types d'items
    
        res.render('itemEdit', { item, notification, types }); // Passez les types à la vue
    },

    async update(req, res) {
        console.log(req.body); 
        console.log(req.file);
        const { id } = req.params;
        const { name, description, item_type, effect, life, value, context, is_obstacle } = req.body;

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
            is_obstacle,
            updated_at: new Date(),
        });

        req.session.notification = {
            message: `Item ${name} mis à jour avec succès`,
            level: 'success',
        };

        res.redirect('/items');
    },

    async duplicate(req, res) {
        const { id } = req.params;
        const item = await Item.findByPk(id);

        if (!item) {
            req.session.notification = {
                message: 'Item non trouvé',
                level: 'error'
            };
            return res.redirect('/items');
        }

        const newItem = await Item.create({
            name: item.name + ' (copie)',
            description: item.description,
            img: item.img,
            item_type: item.item_type,
            effect: item.effect,
            life: item.life,
            value: item.value,
            context: item.context,
            is_obstacle: item.is_obstacle,
            created_at: new Date(),
            updated_at: new Date(),
        });

        req.session.notification = {
            message: `Item ${item.name} duppliqué avec succès`,
            level: 'success',
        };

        const notification =  req.session.notification || null;
        req.session.notification = null;

        res.render('itemEdit', { item: newItem, notification });
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

    async types(req, res) {
        const types = await ItemType.findAll();
        const notification = null;
        res.render('itemTypes', { types, notification });
    },

    async updateTypes(req, res) {
        const { id } = req.params;
        const { name } = req.body;
        const type = await ItemType.findByPk(id);
        if (!type) {
            req.session.notification = {
                message: 'Type non trouvé',
                level: 'error'
            };
            return res.redirect('/items/types');
        }

        await type.update({ name });
        req.session.notification = {
            message: `Type ${name} mis à jour avec succès`,
            level: 'success',
        };
        res.redirect('/items/types');
    },

    async createTypes(req, res) {
        
        const { name } = req.body;
        console.log("Données reçues pour createTypes:", req.body);

        if (!name) {
            req.session.notification = {
                message: "Tous les champs sont requis et doivent être valides.",
                level: 'error'
            };
            return res.redirect('/items/types');
        }

        await ItemType.create({ name });
        req.session.notification = {
            message: `Type ${name} ajouté avec succès`,
            level: 'success',
        };
       
        res.redirect('/items/types');
    },

    async destroyTypes(req, res) {
        const { id } = req.params;
        await ItemType.destroy({ where: { id: id } });
        req.session.notification = {
            message: 'Type supprimé avec succès',
            level: 'success'
        };
        res.redirect('/items/types');
    },



    
};

module.exports = { itemController };
