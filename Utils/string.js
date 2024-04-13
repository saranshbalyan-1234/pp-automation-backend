const singularize = (word) => {
  const endings = {
    es: 'e',
    i: 'us',
    ies: 'y',
    s: '',
    ses: 's',
    ves: 'fe',
    zes: 'ze'
  };
  return word.replace(new RegExp(`(${Object.keys(endings).join('|')})$`), (r) => endings[r]);
};

export { singularize };
