const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Authorization Token is Missing",
            });
        }

        JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: "Unauthorized User",
                });
            } else {
                req.user = { id: decode.id };
                next();
            }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in authentication middleware",
            error,
        });
    }
};