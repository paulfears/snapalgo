"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchTags = void 0;
const lib_1 = require("./lib");
const alreadyPatchedTag = [];
const patchTags = (tags) => {
    tags.forEach((tag) => {
        if (alreadyPatchedTag.find((i) => i === tag))
            return;
        (0, lib_1.addSemanticEncode)(tag, (data) => {
            if (data instanceof lib_1.DataItem) {
                if (data.getTag() === tag) {
                    return data.getData();
                }
            }
        });
        (0, lib_1.addSemanticDecode)(tag, (data) => {
            return new lib_1.DataItem(data, tag);
        });
        alreadyPatchedTag.push(tag);
    });
};
exports.patchTags = patchTags;
//# sourceMappingURL=utils.js.map