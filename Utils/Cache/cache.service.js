import cache from '#utils/Cache/index.js';

const getCachedKeys = () => {
    try {
      return cache.keys();
    } catch (e) {
      throw new Error(e);
    }
  };
  
  export {getCachedKeys}