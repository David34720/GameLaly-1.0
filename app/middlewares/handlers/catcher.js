module.exports = (controllerMethod) => {
    return async function (req, res, next) {
        try {
            await controllerMethod(req, res, next);
        } catch (error) {
            // * On en profit pour enregistrer l'erreur dans log erreur
            // * Quand on appelle next avec un argument, express lève une erreur
            next(error);
        }
    };
};