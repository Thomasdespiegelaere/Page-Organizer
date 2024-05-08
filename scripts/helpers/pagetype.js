export const pageType = {
    Cursus: 1,
    Kladblad: 2,
}

export function getPageType(type) {
    switch (type) {
        case "cursus":
            return pageType.Cursus;
        case "kladbladen":
            return type = pageType.Kladblad;
        default:
            return pageType.Cursus;
    }
}