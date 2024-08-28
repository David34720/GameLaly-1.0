const registerController = {
    index(req, res) {
        const notification = null;

        res.render('register', { notification });
    },

    async store(req, res) {
        res.redirect('/register');
    },
};

module.exports = { registerController };
