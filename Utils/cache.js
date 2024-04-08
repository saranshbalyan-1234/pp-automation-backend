import NodeCache from "node-cache";
const cache = new NodeCache({ checkperiod: 120 });

const get = (key) => {
    return cache.get(key);
};

const set = (key, data, ttl) => {
    return cache.set(key, data, ttl);
};

const del = (key) => {
    return cache.del(key);
};

const keys = () => {
    return cache.keys();
};

export default { get, set, del, keys };
