function initUserSession(req, res, next) {
    let user = null;

    if (req.session?.user) {
        user = req.session.user;
    }

    res.locals.user = user;

    next();
}

module.exports = { initUserSession };
