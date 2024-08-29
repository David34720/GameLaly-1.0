const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const PermissionHasRole = require('../models/PermissionHasRole');

const adminController = {
    async index(req, res) {
        try {
            const users = await User.findAll({
                include: {
                    model: Role,
                    as: 'role',
                    include: {
                        model: Permission,
                        as: 'permissions'
                    }
                }
            });

            const roles = await Role.findAll({
                include: { all: true, nested: true },
            });

            const permissions = await Permission.findAll({
                include: { all: true, nested: true },
            });

            const permissionHasRole = await PermissionHasRole.findAll({
                include: { all: true, nested: true },
            });

            const notification = req.session.notification || null;
            req.session.notification = null; 

            res.render('admin', { users, roles, permissions, permissionHasRole, notification });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur serveur');
        }
    },

    async updateUserRole(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                user.role_id = req.body.role_id;
                await user.save();
            }
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur serveur');
        }
    },

    async deleteUser(req, res) {
        try {
            await User.destroy({ where: { id: req.params.id } });
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur serveur');
        }
    },

    async createRole(req, res) {
        try {
            await Role.create({ name: req.body.role_name });
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur serveur');
        }
    },

    async updateRole(req, res) {
        try {
            const role = await Role.findByPk(req.params.id);
            if (role) {
                role.name = req.body.role_name;
                await role.save();
            }
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur serveur');
        }
    },

    async deleteRole(req, res) {
        try {
            await Role.destroy({ where: { id: req.params.id } });
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur serveur');
        }
    },

    async createPermission(req, res) {
        try {
            await Permission.create({ name: req.body.permission_name });
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur serveur');
        }
    },

    async updatePermission(req, res) {
        try {
            const permission = await Permission.findByPk(req.params.id);
            if (permission) {
                permission.name = req.body.permission_name;
                await permission.save();
            }
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur serveur');
        }
    },

    async deletePermission(req, res) {
        try {
            await Permission.destroy({ where: { id: req.params.id } });
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur serveur');
        }
    },

    async togglePermission(req, res) {
        try {
            const { role_id, permission_id } = req.body;
            const permissionRole = await PermissionHasRole.findOne({
                where: { role_id, permission_id }
            });

            if (permissionRole) {
                await permissionRole.destroy();
            } else {
                await PermissionHasRole.create({ role_id, permission_id });
            }
            res.redirect('/admin');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur serveur');
        }
    }
};

module.exports = { adminController };
