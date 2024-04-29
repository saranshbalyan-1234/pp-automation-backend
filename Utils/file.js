import glob from 'glob';

export const getDirectories = function getDirectories (src = '.', filetype, callback) {
  glob(`${src}/**/*.${filetype}.js`, callback);
};
