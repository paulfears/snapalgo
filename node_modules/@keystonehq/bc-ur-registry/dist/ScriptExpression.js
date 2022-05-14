"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptExpressions = exports.ScriptExpression = void 0;
class ScriptExpression {
    constructor(tag, expression) {
        this.tag = tag;
        this.expression = expression;
        this.getTag = () => this.tag;
        this.getExpression = () => this.expression;
    }
}
exports.ScriptExpression = ScriptExpression;
ScriptExpression.fromTag = (tag) => {
    const se = Object.values(exports.ScriptExpressions).find((se) => se.getTag() === tag);
    return se;
};
exports.ScriptExpressions = {
    SCRIPT_HASH: new ScriptExpression(400, 'sh'),
    WITNESS_SCRIPT_HASH: new ScriptExpression(401, 'wsh'),
    PUBLIC_KEY: new ScriptExpression(402, 'pk'),
    PUBLIC_KEY_HASH: new ScriptExpression(403, 'pkh'),
    WITNESS_PUBLIC_KEY_HASH: new ScriptExpression(404, 'wpkh'),
    COMBO: new ScriptExpression(405, 'combo'),
    MULTISIG: new ScriptExpression(406, 'multi'),
    SORTED_MULTISIG: new ScriptExpression(407, 'sortedmulti'),
    ADDRESS: new ScriptExpression(307, 'addr'),
    RAW_SCRIPT: new ScriptExpression(408, 'raw'),
};
//# sourceMappingURL=ScriptExpression.js.map