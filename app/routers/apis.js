// routes/api.js

const express = require('express');
const router = express.Router();
const { Cell } = require('../models');

router.post('/cells/save', async (req, res) => {
    try {
        const cellsData = req.body;

        // Supprimer toutes les cellules existantes avec les mêmes room_id, pos_x, et pos_y
        for (let cellData of cellsData) {
            await Cell.destroy({
                where: {
                    room_id: cellData.room_id,
                    pos_x: cellData.pos_x,
                    pos_y: cellData.pos_y
                }
            });

            // Ensuite, créer une nouvelle entrée pour chaque cellule
            await Cell.create(cellData);
        }

        res.status(200).json({ message: 'Cellules sauvegardées avec succès' });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des cellules:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

module.exports = router;
