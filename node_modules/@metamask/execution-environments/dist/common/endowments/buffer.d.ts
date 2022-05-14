declare const endowmentModule: {
    names: readonly ["Buffer"];
    factory: () => {
        readonly Buffer: typeof Buffer;
    };
};
export default endowmentModule;
