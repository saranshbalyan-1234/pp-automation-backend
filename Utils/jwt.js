import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

const createToken = (data, secret, expiration) => {
  if (!data) return null;
  try {
    const options = {};
    if (expiration) options.expiresIn = expiration;
    return sign(data, secret, options);
  } catch (err) {
    console.error('Error in Signing Token');
    console.error(err);
  }
};

const getTokenError = (e, type) => {
  if (e.name === 'TokenExpiredError') return `${type} Token Expired`;
  return `Invalid ${type} Found`;
};

const decryptJwt = (jwt) => {
  if (!jwt || typeof jwt !== 'string') return {};
  return verify(jwt, process.env.JWT_ACCESS_SECRET);
};

export { createToken, decryptJwt, getTokenError };
