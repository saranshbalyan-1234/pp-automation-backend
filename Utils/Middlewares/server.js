import { rateLimit } from "express-rate-limit";
import { encryptWithAES } from "#encryption/Service/aes.service.js";
import cors from "cors";
import errorContstants from "#constants/error.js";
import { ValidationError } from "express-validation";
function setupTimeout(app) {
    if (!process.env.TIMEOUT) return console.log(`Timeout is turned OFF`);
    console.log(`Timeout is turned ON with ${process.env.TIMEOUT}`);
    app.use(function (req, res, next) {
        res.setTimeout(parseInt(process.env.TIMEOUT) || 60_000, function () {
            console.error("Request has timed out.", req);
            res.status(408).json({ error: errorContstants.TIMEOUT });
            res.json =
                res.send =
                res.sendFile =
                res.jsonP =
                res.end =
                res.sendStatus =
                    function () {
                        return this;
                    };
        });
        next();
    });
}

function setupRateLimiter(app) {
    if (!process.env.RATE_LIMIT_WINDOW || !process.env.RATE_LIMIT) return console.log(`Rate Limiter is turned OFF`);
    console.log(`Rate Limiter is turned ON with ${process.env.RATE_LIMIT_WINDOW}:${process.env.RATE_LIMIT}`);
    const limiter = rateLimit({
        windowMs: process.env.RATE_LIMIT_WINDOW, // 10 minutes
        limit: process.env.RATE_LIMIT, // Limit each IP to 100 requests per `window` (here, per 10 minutes).
        standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
        message: { error: "Too many requests, please try again later.", limitWindow: process.env.RATE_LIMIT_WINDOW + "s", limit: process.env.RATE_LIMIT },
        // store: ... , // Use an external store for consistency across multiple server instances.
        // skip: (req) => req.url === '/reset',
    });
    app.use(limiter);
}

function setupCors(app) {
    const whitelist = process.env.CORS.split(",");
    // var whitelist = ['http://localhost:8000', 'http://localhost:8080']; //white list consumers
    var corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1 || !process.env.CORS) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "device-remember-token", "Access-Control-Allow-Origin", "Origin", "Accept", 'x-project-id"'],
    };

    app.use(cors(corsOptions));
}

function setupResponseInterceptor(app) {
    console.log("Response Interceptor is Turned ON");
    app.use(function (req, res, next) {
        const originalSend = res.send;
        res.send = function () {
            let errorObj = arguments[0];
            if (typeof errorObj == "object" && errorObj.error) {
                errorObj.method = req.method;
                errorObj.path = req.url;
                errorObj.status = res.statusCode;
                arguments[0] = JSON.stringify(errorObj);
            }
            if (process.env.ENCRYPTION == "true" && !(req.url.includes("decrypt") || req.url.includes("encrypt"))) arguments[0] = JSON.stringify(encryptWithAES(arguments[0]));
            // console.log(result)
            originalSend.apply(res, arguments);
        };

        next();
    });
}

function setupErrorInterceptor(app) {
    console.log("ERROR Interceptor is Turned ON");
    app.use((err, req, res, next) => {
        const errorObj = getErrorObj(req, res);
        const error = String(err);
        if (error === "Error: Not allowed by CORS") {
            return res.status(403).json({
                ...errorObj,
            });
        } else if (error)
            return res.status(403).json({
                error,
                errorObj,
            });
        next(err);
    });
}

function setupValidationErrorInterceptor(app) {
    app.use(function (err, req, res, next) {
        const errorObj = getErrorObj(req, res);
        if (err instanceof ValidationError) {
            const error = err.details.body?.[0].message || err.details.params?.[0].message || err.details.query?.[0].message || err.details.headers?.[0].message;
            return res.status(400).json({ error, ...errorObj });
        }
        next(err);
    });
}

function getErrorObj(req, res) {
    return {
        method: req.method,
        path: req.url,
        status: res.statusCode,
    };
}

export { setupTimeout, setupRateLimiter, setupCors, setupResponseInterceptor, setupErrorInterceptor, setupValidationErrorInterceptor };
