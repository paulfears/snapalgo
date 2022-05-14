"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSnapRpc = exports.isExecuteSnap = exports.isTerminate = exports.isPing = exports.isAnyOfSnapNameSourceCodeEndowmentsTargetOriginJsonRpcRequestOKOKOKSnapRpcResult = exports.isSnapRpcResult = exports.isOK = exports.isJsonRpcRequest = exports.isOrigin = exports.isTarget = exports.isEndowments = exports.isSourceCode = exports.isSnapName = exports.isJSONRPCParams = exports.isJSONRPCParamsAsObject = exports.isJSONRPCParamsAsArray = exports.isJSONRPCMethod = exports.isJSONRPCID = exports.isNumberHo1ClIqD = exports.isStringDoaGddGA = exports.isJSONRPCString = exports.isEndowment = void 0;
function isEndowment(obj, _argumentName) {
    return (typeof obj === "string");
}
exports.isEndowment = isEndowment;
function isJSONRPCString(obj, _argumentName) {
    return (obj === "2.0");
}
exports.isJSONRPCString = isJSONRPCString;
function isStringDoaGddGA(obj, _argumentName) {
    return (typeof obj === "string");
}
exports.isStringDoaGddGA = isStringDoaGddGA;
function isNumberHo1ClIqD(obj, _argumentName) {
    return (typeof obj === "number");
}
exports.isNumberHo1ClIqD = isNumberHo1ClIqD;
function isJSONRPCID(obj, _argumentName) {
    return ((isEndowment(obj) ||
        isNumberHo1ClIqD(obj)));
}
exports.isJSONRPCID = isJSONRPCID;
function isJSONRPCMethod(obj, _argumentName) {
    return (typeof obj === "string");
}
exports.isJSONRPCMethod = isJSONRPCMethod;
function isJSONRPCParamsAsArray(obj, _argumentName) {
    return (Array.isArray(obj) &&
        obj.every((e) => isSnapRpcResult(e)));
}
exports.isJSONRPCParamsAsArray = isJSONRPCParamsAsArray;
function isJSONRPCParamsAsObject(obj, _argumentName) {
    return ((obj !== null &&
        typeof obj === "object" ||
        typeof obj === "function") &&
        Object.entries(obj)
            .every(([key, value]) => (isSnapRpcResult(value) &&
            isEndowment(key))));
}
exports.isJSONRPCParamsAsObject = isJSONRPCParamsAsObject;
function isJSONRPCParams(obj, _argumentName) {
    return ((isJSONRPCParamsAsArray(obj) ||
        isJSONRPCParamsAsObject(obj)));
}
exports.isJSONRPCParams = isJSONRPCParams;
function isSnapName(obj, _argumentName) {
    return (typeof obj === "string");
}
exports.isSnapName = isSnapName;
function isSourceCode(obj, _argumentName) {
    return (typeof obj === "string");
}
exports.isSourceCode = isSourceCode;
function isEndowments(obj, _argumentName) {
    return (Array.isArray(obj) &&
        obj.every((e) => isEndowment(e)));
}
exports.isEndowments = isEndowments;
function isTarget(obj, _argumentName) {
    return (typeof obj === "string");
}
exports.isTarget = isTarget;
function isOrigin(obj, _argumentName) {
    return (typeof obj === "string");
}
exports.isOrigin = isOrigin;
function isJsonRpcRequest(obj, _argumentName) {
    return ((obj !== null &&
        typeof obj === "object" ||
        typeof obj === "function") &&
        isJSONRPCString(obj.jsonrpc) &&
        (typeof obj.id === "undefined" ||
            isEndowment(obj.id) ||
            isNumberHo1ClIqD(obj.id)) &&
        isEndowment(obj.method) &&
        (typeof obj.params === "undefined" ||
            isJSONRPCParamsAsArray(obj.params) ||
            isJSONRPCParamsAsObject(obj.params)) &&
        Object.entries(obj)
            .filter(([key]) => !["jsonrpc", "id", "method", "params"].includes(key))
            .every(([key, value]) => (isSnapRpcResult(value) &&
            isEndowment(key))));
}
exports.isJsonRpcRequest = isJsonRpcRequest;
function isOK(obj, _argumentName) {
    return (obj === "OK");
}
exports.isOK = isOK;
function isSnapRpcResult(obj, _argumentName) {
    return (true);
}
exports.isSnapRpcResult = isSnapRpcResult;
function isAnyOfSnapNameSourceCodeEndowmentsTargetOriginJsonRpcRequestOKOKOKSnapRpcResult(obj, _argumentName) {
    return (true);
}
exports.isAnyOfSnapNameSourceCodeEndowmentsTargetOriginJsonRpcRequestOKOKOKSnapRpcResult = isAnyOfSnapNameSourceCodeEndowmentsTargetOriginJsonRpcRequestOKOKOKSnapRpcResult;
function isPing(obj, _argumentName) {
    return (typeof obj === "function");
}
exports.isPing = isPing;
function isTerminate(obj, _argumentName) {
    return (typeof obj === "function");
}
exports.isTerminate = isTerminate;
function isExecuteSnap(obj, _argumentName) {
    return (typeof obj === "function");
}
exports.isExecuteSnap = isExecuteSnap;
function isSnapRpc(obj, _argumentName) {
    return (typeof obj === "function");
}
exports.isSnapRpc = isSnapRpc;
//# sourceMappingURL=openrpc.guard.js.map