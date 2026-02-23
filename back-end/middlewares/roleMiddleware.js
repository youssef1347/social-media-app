// function takes roles as a parameter and return callback function
function roleMiddleware(...roles) {
    // call back middleware
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'unauthorized' });
        }

        const { role } = req.user;

        // check if the roles includes user role
        const isInclude = roles.includes(role);
        if (!isInclude) {
            return res.status(403).json({ message: "you can't access this page" });
        }


        next();
    }
}

module.exports = { roleMiddleware };