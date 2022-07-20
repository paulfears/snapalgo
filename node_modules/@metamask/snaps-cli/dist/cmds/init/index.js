"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const builders_1 = __importDefault(require("../../builders"));
const buildHandler_1 = require("../build/buildHandler");
const initHandler_1 = require("./initHandler");
const initUtils_1 = require("./initUtils");
/**
 * The main entrypoint for the init command. This calls the init handler to
 * initialize the snap package, builds the snap, and then updates the manifest
 * with the shasum of the built snap.
 *
 * @param argv - The Yargs arguments object.
 */
async function init(argv) {
    console.log();
    const newArgs = await (0, initHandler_1.initHandler)(argv);
    await (0, buildHandler_1.build)(Object.assign(Object.assign({}, newArgs), { manifest: false, eval: true }));
    await (0, initHandler_1.updateManifestShasum)();
    console.log('\nSnap project successfully initiated!');
}
module.exports = {
    command: ['init', 'i'],
    desc: 'Initialize Snap package',
    builder: (yarg) => {
        yarg
            .option('src', builders_1.default.src)
            .option('dist', builders_1.default.dist)
            .option('port', builders_1.default.port)
            .option('outfileName', builders_1.default.outfileName)
            .option('template', builders_1.default.template)
            .middleware(((yargsArgv) => {
            (0, initUtils_1.correctDefaultArgs)(yargsArgv);
        }), true);
    },
    handler: (argv) => init(argv),
};
//# sourceMappingURL=index.js.map