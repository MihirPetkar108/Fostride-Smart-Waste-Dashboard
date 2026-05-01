function adminAuth(req, res, next) {
    const role = req.role;

    if (role !== "admin") {
        res.status(403).json({
            message: "You don't have permissions to access this route!",
        });
        return;
    }

    next();
}

export default adminAuth;
