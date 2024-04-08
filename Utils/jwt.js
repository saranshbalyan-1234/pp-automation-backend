import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

const createToken = (data, secret, expiration) => {
    if (!data) return null;
    try {
        let options = {};
        if (expiration) options.expiresIn = expiration;
        console.log("saransh",secret)
        return sign(data, secret, options);
    } catch (err) {
        console.error("Error in Signing Token");
        console.error(err);
    }
};

const getTokenError = (e, type) => {
    switch (e.name) {
        case "TokenExpiredError":
            return `${type} Token Expired`;
        default:
            return `Invalid ${type} Found`;
    }
};
const extractToken = (req) => {
    return req.headers.authorization || "";
    // if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    //     return req.headers.authorization.split(" ")[1];
    // } else return null;
};

const decryptJwt = (jwt) => {
    if (!jwt || typeof jwt != "string") return {};
    return verify(jwt, process.env.JWT_ACCESS_SECRET);
};

export { createToken, getTokenError, extractToken, decryptJwt };
