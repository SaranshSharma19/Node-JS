require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const proxy = require("express-http-proxy");
const { validateToken } = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    console.log(`Request body:`, req.body);
    next();
});

const proxyOptions = {
    proxyErrorHandler: (err, res, next) => {
        console.error(`Proxy error: ${err.message}`);
        res.status(500).json({
            message: `Internal server error`,
            error: err.message,
        });
    },
};

app.use(
    "/v1/auth",
    proxy(process.env.IDENTITY_SERVICE_URL, {
        proxyReqPathResolver: (req) => req.originalUrl.replace(/^\/v1\/auth/, "/auth"),
        ...proxyOptions,
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            proxyReqOpts.headers["Content-Type"] = "application/json";
            return proxyReqOpts;
        },
        userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
            console.log(
                `Response received from Identity service: ${proxyRes.statusCode}`
            );
            return proxyResData;
        },
    })
);

app.use(
    "/v1/products",
    proxy(process.env.PRODUCT_SERVICE_URL, {
        proxyReqPathResolver: (req) => req.originalUrl.replace(/^\/v1\/products/, "/api"),
        ...proxyOptions,
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            proxyReqOpts.headers = {
                ...srcReq.headers,
            };
            return proxyReqOpts;
        },
        userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
            console.log(
                `Response received from Product service: ${proxyRes.statusCode}`
            );
            return proxyResData;
        },
    })
);

app.use(
    "/v1/inventory",
    proxy(process.env.INVENTORY_SERVICE_URL, {
        proxyReqPathResolver: (req) => req.originalUrl.replace(/^\/v1\/inventory/, "/api"),
        ...proxyOptions,
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            proxyReqOpts.headers["Content-Type"] = "application/json";
            return proxyReqOpts;
        },
        userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
            console.log(
                `Response received from Inventory service: ${proxyRes.statusCode}`
            );
            return proxyResData;
        },
    })
);

app.use(
    "/v1/cart",
    proxy(process.env.CART_SERVICE_URL, {
        proxyReqPathResolver: (req) => req.originalUrl.replace(/^\/v1\/cart/, "/api/cart"),
        ...proxyOptions,
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            proxyReqOpts.headers["Content-Type"] = "application/json";
            return proxyReqOpts;
        },
        userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
            console.log(
                `Response received from Cart service: ${proxyRes.statusCode}`
            );
            return proxyResData;
        },
    })
);

app.use(
    "/v1/orders",
    validateToken,
    proxy(process.env.ORDER_SERVICE_URL, {
        proxyReqPathResolver: (req) => req.originalUrl.replace(/^\/v1\/orders/, "/api"),
        ...proxyOptions,
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            proxyReqOpts.headers["Content-Type"] = "application/json";
            return proxyReqOpts;
        },
        userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
            console.log(
                `Response received from Order service: ${proxyRes.statusCode}`
            );
            return proxyResData;
        },
    })
);

app.use(
    "/v1/payments",
    validateToken,
    proxy(process.env.PAYMENT_SERVICE_URL, {
        proxyReqPathResolver: (req) => req.originalUrl.replace(/^\/v1\/payments/, "/api"),
        ...proxyOptions,
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            proxyReqOpts.headers["Content-Type"] = "application/json";
            return proxyReqOpts;
        },
        userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
            console.log(
                `Response received from Payment service: ${proxyRes.statusCode}`
            );
            return proxyResData;
        },
    })
);

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
    console.log(`Identity service: ${process.env.IDENTITY_SERVICE_URL}`);
    console.log(`Product service: ${process.env.PRODUCT_SERVICE_URL}`);
    console.log(`Inventory service: ${process.env.INVENTORY_SERVICE_URL}`);
    console.log(`Cart service: ${process.env.CART_SERVICE_URL}`);
    console.log(`Order service: ${process.env.ORDER_SERVICE_URL}`);
    console.log(`Payment service: ${process.env.PAYMENT_SERVICE_URL}`);
});