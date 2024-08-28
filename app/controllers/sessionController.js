const sessionController = {
    index(req, res) {
        const notification = null;
        res.render('login', { notification });
        
    },

    async store(req, res) {
        res.redirect('/login');
    },

    async destroy(req, res) {
        res.redirect('/');
    },
};

module.exports = { sessionController };
