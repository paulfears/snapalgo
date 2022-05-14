declare enum STYLES {
    STANDARD = "standard",
    URI = "uri",
    MINIMAL = "minimal"
}
declare const _default: {
    decode: (string: string, style?: STYLES) => string;
    encode: (string: string, style?: STYLES) => string;
    STYLES: typeof STYLES;
};
export default _default;
