"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const RegistryType_1 = require("./RegistryType");
const ScriptExpression_1 = require("./ScriptExpression");
const registryTags = Object.values(RegistryType_1.RegistryTypes)
    .filter((r) => !!r.getTag())
    .map((r) => r.getTag());
const scriptExpressionTags = Object.values(ScriptExpression_1.ScriptExpressions).map((se) => se.getTag());
(0, utils_1.patchTags)(registryTags.concat(scriptExpressionTags));
//# sourceMappingURL=patchCBOR.js.map