function singularize(word) {
    const endings = {
        ves: "fe",
        ies: "y",
        i: "us",
        zes: "ze",
        ses: "s",
        es: "e",
        s: "",
    };
    return word.replace(new RegExp(`(${Object.keys(endings).join("|")})$`), (r) => endings[r]);
}

export { singularize };
