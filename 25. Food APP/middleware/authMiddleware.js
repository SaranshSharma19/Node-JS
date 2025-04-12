const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        JWT.verify(token, process.env.JWT_SECRET, async (err, decode) => {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: "Un-Authorize User",
                });
            } else {
                req.body.id = decode.id;
                next();
            }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Please Provide Auth Token",
            error,
        });
    }
};