import jwt from "jsonwebtoken";

function authMiddleWare(req, res, next) {
    try {
        const token = req.headers.token;
        if (!token) {
            res.status(403).json({
                message: "Token is malformed!",
            });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWTSECRET);
        const username = decoded.username;
        const role = decoded.role;
        if (!username) {
            res.status(403).json({
                message: "User doesn't exists or token malformed!",
            });
            return;
        }

        req.username = username;
        req.role = role;
        next();
    } catch (e) {
        res.status(500).json({
            message: `Invalid or missing token! Error: ${e}`,
        });
        return;
    }
}

export default authMiddleWare;
