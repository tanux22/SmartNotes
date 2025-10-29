
const validateRole = (req, res, next) => {
    const roles = req.user.role;
    if(roles !== 'admin') {
        const error = new Error("Access denied. Admins only.");
        error.statusCode = 403;
        return next(error);
    }
    next();
};

export default validateRole;